import React from 'react';
import { client, hostedFields } from 'braintree-web';
import fetch from 'isomorphic-unfetch';

class IndexComponent extends React.Component {
	braintreeClient;
	fieldsInstance;

	fieldTextStyles = {
		'input': {
			'font-family': 'monospace',
			'font-size': '20px',
			'color': 'blue'
		}
	};
	fields = {
		number: {
			selector: '#card-number',
			placeholder: '4111 1111 1111 1111'
		},
		cvv: {
			selector: '#cvv',
			placeholder: '123'
		},
		expirationDate: {
			selector: '#expiration-date',
			placeholder: '10/2019'
		}
	};

	fieldGenerationCallback = (instance) => {
		const submit = document.getElementById('submitButton');
		const placeholderInputs = document.getElementsByClassName('placeholder');

		for (var i = 0; i < placeholderInputs.length; i++) {
			placeholderInputs[i].parentNode.removeChild(placeholderInputs[i]);
		}
		
		submit.removeAttribute('disabled');
		this.fieldsInstance = instance;
	}
	fieldGenerationError = (error) => {
		console.log('fieldGenerationCallback');
		console.error(error);
		return;
	}

	submitCardDetails = (e) => {
		e.preventDefault();

		this.fieldsInstance.tokenize((err, payload) => {
			if (err) {
				console.log('instance.tokenize');
				console.error(err);
				return;
			}

			fetch('http://localhost:3001/checkout', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ paymentMethodNonce: payload.nonce})
			}).then(result => result.json()).then(json => {
				if (json.success) {
					console.log('GREAT SUCCESS', json);
				} else {
					console.log('result', json);
				}
			}).catch(error => {
				console.log('checkout error', error);
			});
		});
	}

	static async getInitialProps() {
		const tokenResponse = await fetch('http://localhost:3001/token');
		const token = await tokenResponse.text();

		return { token };
	}

	componentDidMount() {
		client.create({
			authorization: 'sandbox_n2npx3xs_pkz3mj2rrtx56jh2'
		}).then((instance) => {
			hostedFields.create({
				client: instance,
				styles: this.fieldTextStyles,
				fields: this.fields
			}).then(this.fieldGenerationCallback).catch(this.fieldGenerationError);
		});
	}

	render() {
		return (
			<div>
				<h1>Payment!</h1>

			    <form id="my-sample-form" onSubmit={this.submitCardDetails}>
			    	<label htmlFor="card-number">Card Number</label>
			    	<div id="card-number">
			      		<input className="placeholder" type="text" disabled />
			      	</div>

					<label htmlFor="cvv">CVV</label>
					<div id="cvv"><input className="placeholder" disabled /></div>

					<label htmlFor="expiration-date">Expiration Date</label>
					<div id="expiration-date" className="hosted-field"></div>	

					<button id="submitButton" disabled>Pay</button>
			    </form>

			</div>
		);
	}
}

export default IndexComponent;