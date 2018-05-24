import React from 'react';
import styled, { hydrate, keyframes, css, injectGlobal } from 'react-emotion';

type Props = {
    onSubmit: (e: any) => void
}

const basicStyles = css`
    background-color: white;
    border-radius: 5px;
    box-shadow: 3px 4px 12px rgba(80, 75, 75, 0.34);
    color: darkgrey;
    border: 1px solid #d8d8d8;
    transition: all 0.1s linear;
    margin: 1rem 0;
    padding: 1rem 0.5rem;
    display: grid;
    grid-auto-columns: auto;
    grid-gap: 20px;


    .lg {
        grid-column: 1 / span 2;
    }

    .hosted-fields--label {
        font-family: courier, monospace;
        text-transform: uppercase;
        font-size: 14px;
        display: block;
        margin-bottom: 6px;
    }


  button {
    max-width: 240px;
    width: 100%;
    height: 60px;
    margin: 0;
    border-radius: 5px;
    background: green;
    color: white;
    font-size: 18px;
    cursor: pointer;
    grid-column: 1 / span 1;

      &:hover {
          background: darkgreen;
        }
  }

  .placeholder {
    border-radius: 6px;
    border: 1px solid #d8d8d8;
    width: 100%;
    height: 50px;
    oveflow: hidden;
  }

  .hosted-field {
    height: 50px;
    box-sizing: border-box;
    width: 100%;
    padding: 12px;
    margin-top: 5px;
    display: inline-block;
    box-shadow: none;
    font-weight: 600;
    font-size: 16px;
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
`

const label = css`
    color: #353535;
    font-size: 16px;
`

class PaymentForm extends React.Component<Props> {
    render (){
        return (
            <form id="my-sample-form" onSubmit={this.props.onSubmit} className={basicStyles}>
                <div className="input-group lg">
                    <label htmlFor="card-number" className={label}>Card Number</label>
                    <div id="card-number" className="hosted-field"></div>
                </div>

                <div className="inputGroup sm">
                    <label htmlFor="cvv" className={label}>CVV</label>
                    <div id="cvv" className="hosted-field"></div>
                </div>

                <div className="inputGroup sm">
                    <label htmlFor="expiration-date" className={label}>Expiration Date</label>
                    <div id="expiration-date" className="hosted-field"></div>
                </div>

                <button id="submitButton" disabled>Confirm and Buy</button>
            </form>
        )
    }
}

export default PaymentForm
