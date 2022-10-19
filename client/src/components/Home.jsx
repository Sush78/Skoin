import React, {useState} from 'react'

export const Home = () => {

  const userTokens = 0  
  const totalTokensSold = 0
  const totalTokensAvailable = 1000000
  const [inputTokens, setInputTokens] = useState(0)

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  
  return (
    <div>
        <h1>Skoin Token ICO Sale</h1>
        <hr id='white-line'></hr>
        <p>Introducing Skoin Token (SKM)! Token price: <span className='bold'>0.00001 Ether</span></p>
        <p>You currently have {userTokens} tokens</p>
        <div className='input'>
            <input
                placeholder="Amount of Skoin you want to buy"
                type="number"
                step="0.0001"
                value={inputTokens}
                onChange={(e) => handleChange(e, name)}
                className="form-input"
            />
            <button onClick={handleSubmit} className='form-button'>Buy</button>
        </div>
        <p>Total Skoins sold: <span className='bold'>{totalTokensSold}</span> out of {totalTokensAvailable}</p>
        <div className='notice'>
            <p>NOTICE: This ICO sale is held on Goerli test network with test Ether. Please install browser wallet like Metamask to take part in the sale. Skoin stands for Sushant Kumar coin whos is the creator for the same</p>
        </div>
    </div>
  )
}
