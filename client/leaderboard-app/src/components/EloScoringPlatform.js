import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EloScoringPlatform = () => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [userInput, setUserInput] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [responses, setResponses] = useState({ responseA: '', responseB: '' });
  const [models, setModels] = useState({ model1: '', model2: '' });
  const [showResults, setShowResults] = useState(false);
  const [voted, setVoted] = useState(false); 
  const [winner, setWinner] = useState('');
  const [gameNumber, setGameNumber] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false); 
  const API_BASE_URL =  process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUseCases = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fetch_use_cases`);
        setOptions(response.data);
        if (response.data.length > 0) setSelectedOption(response.data[0]);
      } catch (error) {
        console.error('Error fetching use cases:', error);
      }
    };

    fetchUseCases();
  }, [API_BASE_URL]);

  const fetchPrompts = async () => {
    try {
      setSubmitClicked(true);
      const response = await axios.get(`${API_BASE_URL}/random_prompts/${selectedOption}`);
      setPrompts(response.data);
      await fetchResponses(response.data, userInput);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
  };

  const fetchResponses = async (prompts, input) => {
    try {
      const response1 = await handleResponse(prompts[0], input);
      const response2 = await handleResponse(prompts[1], input);
      setResponses({ responseA: response1, responseB: response2 });
      setModels({ model1: prompts[0].origin, model2: prompts[1].origin });
      setShowResults(true); // Show results after fetching responses
      setVoted(false); // Reset voting status
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleResponse = async (prompt, userInput) => {
    if (prompt.origin === 'Conva Assistant') {
      return await fetchConvaAIResponse(prompt.assistant_id, prompt.assistant_version, prompt.assistant_apikey, userInput);
    } else {
      return await fetchOpenAIResponse(prompt.prompt.replace('{query}', userInput));
    }
  };

  const fetchOpenAIResponse = async (prompt, model = 'gpt-4o-mini-2024-07-18') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/openai_response`, {
        model: model,
        prompt: prompt,
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching OpenAI response:', error);
      return `Error fetching OpenAI response: ${error.message}`;
    }
  };

  const fetchConvaAIResponse = async (assistantId, assistantVersion, apiKey, query) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/conva_response`, {
        assistant_id: assistantId,
        assistant_version: assistantVersion,
        api_key: apiKey,
        prompt: query,
        use_case: selectedOption
      });
      return response.data.response;
    } catch (error) {
      console.error('Error fetching Conva AI response:', error);
      return `Error fetching Conva AI response: ${error.message}`;
    }
  };

  const handleVote = async (modelName, result) => {
    try {
      setWinner(modelName);
      setVoted(true); 
      await axios.post(`${API_BASE_URL}/update_elo`, {
        model_a: models.model1,
        model_b: models.model2,
        result: result,
      });

      await fetchGameNumber();

      setTimeout(async () => {
        await handleAddResponse();
        resetSession();
      }, 1000);
    } catch (error) {
      console.error('Error updating ELO:', error);
    }
  };

  const fetchGameNumber = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/total_games`);
      setGameNumber(response.data);
    } catch (error) {
      console.error('Error fetching total games:', error);
    }
  };

  const handleAddResponse = async () => {
    try {
      await axios.post(`${API_BASE_URL}/add_response`, {
        game_no: gameNumber + 1,
        query: userInput,
        use_case: selectedOption,
        model_a: models.model1,
        model_b: models.model2,
        response_a: responses.responseA,
        response_b: responses.responseB,
        winner_model: winner,
      });
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  const resetSession = () => {
    setUserInput('');
    setResponses({ responseA: '', responseB: '' });
    setModels({ model1: '', model2: '' });
    setShowResults(false);
    setVoted(false); // Reset voting status
    setWinner('');
    setSubmitClicked(false); // Show submit button again
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#2c2f33', color: '#ffffff', height: '100vh' }}>
      <div className="text-center mb-4">
        <h1 className="elo-title">ELO Scoring Platform for LLMs</h1>
      </div>

      <div className="row mb-4">
        <div className="col text-center">
          <select
            className="form-select form-select-lg bg-dark text-white"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            style={{ maxWidth: '400px', margin: '0 auto' }}
          >
            {options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Model A</h5>
              <textarea
                className="form-control bg-secondary text-white"
                value={responses.responseA}
                readOnly
                rows="15"
                style={{ resize: 'none' }}
              />
              {voted && <p className="mt-2">Model: {models.model1}</p>}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <div className="card bg-dark text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Model B</h5>
              <textarea
                className="form-control bg-secondary text-white"
                value={responses.responseB}
                readOnly
                rows="15"
                style={{ resize: 'none' }}
              />
              {voted && <p className="mt-2">Model: {models.model2}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col text-center">
          <input
            type="text"
            className="form-control form-control-lg bg-dark text-white"
            placeholder="Enter your input here"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          />
          {!submitClicked && (
            <button className="btn btn-primary btn-lg mt-3" onClick={fetchPrompts}>Submit</button>
          )}
        </div>
      </div>

      {showResults && (
        <div className="row">
          <div className="col text-center">
            <div className="btn-group" role="group" aria-label="Vote options">
              <button
                className="btn btn-outline-success btn-lg"
                onClick={() => handleVote(models.model1, 'win')}
                disabled={voted} // Disable the button after voting
              >
                👈 Left
              </button>
              <button
                className="btn btn-outline-warning btn-lg"
                onClick={() => handleVote('both_good', 'both_good')}
                disabled={voted} 
              >
                Both Good
              </button>
              <button
                className="btn btn-outline-danger btn-lg"
                onClick={() => handleVote('both_bad', 'both_bad')}
                disabled={voted} 
              >
                Both Bad
              </button>
              <button
                className="btn btn-outline-success btn-lg"
                onClick={() => handleVote(models.model2, 'win')}
                disabled={voted} // Disable the button after voting
              >
                Right 👉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EloScoringPlatform;
