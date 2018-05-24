import React from 'react';
import { client, hostedFields } from 'braintree-web';
import fetch from 'isomorphic-unfetch';
import PaymentForm from '../components/PaymentForm';
import styled, { hydrate, keyframes, css, injectGlobal } from 'react-emotion';

injectGlobal`
  html, body {
    padding: 0;
    margin: 0;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 24px;
  }
  * {
   box-sizing: border-box;
  }
`

const container = css`
	max-width: 800px;
	margin: 0 auto;
`

const h1 = css`
	color: #353535;
	font-size: 24px;
`

class IndexComponent extends React.Component {
	braintreeClient;
	fieldsInstance;

	fieldTextStyles = {
		'input': {
			'font-family': 'Helvetica',
			'font-size': '16px',
			'color': '#353535'
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
			<div className={container}>
				<h1 className={h1}>Payment</h1>
				<PaymentForm onSubmit={this.submitCardDetails} />
			</div>
		);
	}
}

export default IndexComponent;