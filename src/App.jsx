import './App.css'
import copyIcon from './assets/icons/copy.svg';
import { useState, useRef } from 'react';
import { Configuration, OpenAIApi } from 'openai';

function App() {

  // OpenAI API Configuration
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  })

  // OpenAI API Instance
  const openai = new OpenAIApi(configuration);

  // State Variables
  const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const copyBtnPara = useRef(null);

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: "system", content: "You are a helpful regular expression generator." },
          { role: "system", content: "Only respond with a regular expression. Do not include extra words." },
          { role: "user", content: `${prompt}` }
        ],
        temperature: 0,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
      console.log(response.data.choices[0].message.content)
      setApiResponse(response.data.choices[0].message.content);
    } catch (err) {
      console.log(err);
      setApiResponse("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  // Copy Regex to Clipboard
  const copyRegex = () => {
    const regex = apiResponse;
    navigator.clipboard.writeText(regex);
    copyBtnPara.current.innerText = "Copied";
  }


  return (
    <>
      <header className='header'>
        <h1>RegEx Generator</h1>
      </header>
      <main className='main'>
        <form className='form' onSubmit={handleSubmit}>
          <input type="text" name="prompt" placeholder='Enter text to generate regex' onInput={(e) => setPrompt(e.currentTarget.value)} value={prompt} />
          <input type="submit" value="Generate" />
        </form>
        {loading ? <h1 className='loading'>Please wait...</h1> : apiResponse.length > 0 && <fieldset className='result'>
          <legend>RegEx Output</legend>
          <div className='output'>
            <p>{apiResponse}</p>
            <button className="copy-btn" onClick={copyRegex}><img src={copyIcon} alt="copy" /><p ref={copyBtnPara}>Copy</p></button>
          </div>
        </fieldset>}
      </main >
    </>
  )
}

export default App