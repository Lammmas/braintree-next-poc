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
				<style jsx>{`
					.hosted-field {
					  height: 50px;
					  box-sizing: border-box;
					  width: 100%;
					  padding: 12px;
					  display: inline-block;
					  box-shadow: none;
					  font-weight: 600;
					  font-size: 14px;
					  border-radius: 6px;
					  border: 1px solid #dddddd;
					  line-height: 20px;
					  background: #fcfcfc;
					  margin-bottom: 12px;
					  background: linear-gradient(to right, white 50%, #fcfcfc 50%);
					  background-size: 200% 100%;
					  background-position: right bottom;
					  transition: all 300ms ease-in-out;
					}

					.hosted-fields--label {
					  font-family: courier, monospace;
					  text-transform: uppercase;
					  font-size: 14px;
					  display: block;
					  margin-bottom: 6px;
					}

					.button-container {
					  display: block;
					  text-align: center;
					}

					.button {
					  cursor: pointer;
					  font-weight: 500;
					  line-height: inherit;
					  position: relative;
					  text-decoration: none;
					  text-align: center;
					  border-style: solid;
					  border-width: 1px;
					  border-radius: 3px;
					  -webkit-appearance: none;
					  -moz-appearance: none;
					  display: inline-block;
					}

					.button--small {
					  padding: 10px 20px;
					  font-size: 0.875rem;
					}

					.button--green {
					  outline: none;
					  background-color: #64d18a;
					  border-color: #64d18a;
					  color: white;
					  transition: all 200ms ease;
					}

					.button--green:hover {
					  background-color: #8bdda8;
					  color: white;
					}

					.braintree-hosted-fields-focused {
					  border: 1px solid #64d18a;
					  border-radius: 1px;
					  background-position: left bottom;
					}

					.braintree-hosted-fields-invalid {
					  border: 1px solid #ed574a;
					}

					.braintree-hosted-fields-valid {
					}

					.braintree-hosted-fields-valid input {
						color: green;
					}
				`}</style>
			</div>
		);
	}
}

export default IndexComponent;