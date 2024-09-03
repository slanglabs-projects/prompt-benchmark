import streamlit as st
import aiohttp
import asyncio
import nest_asyncio
import os
import json
from dotenv import load_dotenv

nest_asyncio.apply()
load_dotenv()
API_BASE_URL = os.getenv("API_BASE_URL")

# Helper function to fetch data from the API
async def fetch_api(endpoint, method="GET", data=None):
    async with aiohttp.ClientSession() as session:
        try:
            if method == "GET":
                async with session.get(f"{API_BASE_URL}{endpoint}") as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        st.error(f"Error fetching data: HTTP {response.status}")
                        return []
            elif method == "POST":
                async with session.post(
                    f"{API_BASE_URL}{endpoint}", json=data
                ) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        st.error(f"Error posting data: HTTP {response.status}")
                        return []
        except aiohttp.ClientError as e:
            st.error(f"Network error: {str(e)}")
            return []

# Updated function to fetch OpenAI response via API
async def fetch_openai_response(prompt, model="gpt-4o-mini-2024-07-18"):
    response = await fetch_api(
        "/openai_response",
        method="POST",
        data={
            "api_key": os.getenv("OPENAI_API_KEY"),
            "model": model,
            "prompt": prompt
        }
    )
    return response.get("response", "")

# Updated function to fetch Conva AI response via API
async def fetch_conva_ai_response(assistant_id, assistant_version, api_key, query):
    response = await fetch_api(
        "/conva_response",
        method="POST",
        data={
            "assistant_id": assistant_id,
            "assistant_version": assistant_version,
            "api_key": api_key,
            "prompt": query,
            "use_case": selected_option
        }
    )
    return response.get("response", "")

def main():
    st.title("ELO Scoring Platform for LLMs")

    async def handle_response(prompt, model_name, assistant_data=None):
        if model_name == "Conva Assistant":
            assistant_id = assistant_data["assistant_id"]
            assistant_version = str(assistant_data["assistant_version"])
            api_key = assistant_data["assistant_apikey"]
            response = await fetch_conva_ai_response(
                assistant_id, assistant_version, api_key, prompt
            )
        else:
            response = await fetch_openai_response(prompt)
        return response

    async def fetch_responses(user_input):
        prompts = await fetch_api(f"/random_prompts/{selected_option}")

        if prompts[0]["origin"] == "Conva Assistant":
            assistant_data1 = prompts[0]
            prompt1 = user_input
        else:
            assistant_data1 = None
            prompt1 = prompts[0]["prompt"].replace("{query}", user_input)

        if prompts[1]["origin"] == "Conva Assistant":
            assistant_data2 = prompts[1]
            prompt2 = user_input
        else:
            assistant_data2 = None
            prompt2 = prompts[1]["prompt"].replace("{query}", user_input)

        response1, response2 = await asyncio.gather(
            handle_response(prompt1, prompts[0]["origin"], assistant_data1),
            handle_response(prompt2, prompts[1]["origin"], assistant_data2),
        )

        st.session_state.prompt1 = prompt1
        st.session_state.prompt2 = prompt2
        st.session_state.llm1_response = response1
        st.session_state.llm2_response = response2
        st.session_state.model1_name = prompts[0]["origin"]
        st.session_state.model2_name = prompts[1]["origin"]

        st.session_state.show_results = False
        st.rerun()

    options = asyncio.run(fetch_api("/fetch_use_cases"))
    selected_option = st.selectbox("Select Use Case", options)

    col1, col2 = st.columns(2)

    if "llm1_response" not in st.session_state:
        st.session_state.llm1_response = ""
    if "llm2_response" not in st.session_state:
        st.session_state.llm2_response = ""
    if "model1_name" not in st.session_state:
        st.session_state.model1_name = ""
    if "model2_name" not in st.session_state:
        st.session_state.model2_name = ""
    if "prompt1" not in st.session_state:
        st.session_state.prompt1 = ""
    if "prompt2" not in st.session_state:
        st.session_state.prompt2 = ""
    if "user_input" not in st.session_state:
        st.session_state.user_input = ""
    if "show_results" not in st.session_state:
        st.session_state.show_results = False
    if "winner" not in st.session_state:
        st.session_state.winner = ""
    if "voting" not in st.session_state:
        st.session_state.voting = True

    user_input = st.text_input("Enter your input here:")

    if user_input and user_input != st.session_state.user_input:
        st.session_state.user_input = user_input
        asyncio.run(fetch_responses(user_input))

    with col1:
        st.subheader("Response A")
        st.text_area(
            "Model A", st.session_state.llm1_response, height=300, key="model_a", disabled=True
        )

    with col2:
        st.subheader("Response B")
        st.text_area(
            "Model B", st.session_state.llm2_response, height=300, key="model_b", disabled=True
        )

    if st.session_state.llm1_response and st.session_state.llm2_response and st.session_state.voting:
        st.subheader("Rate the responses")
        col4, col5, col6, col7 = st.columns(4)

        def vote(model_name, result):
            st.session_state.voting = False
            st.session_state.winner = model_name
            asyncio.run(
                fetch_api(
                    "/update_elo",
                    method="POST",
                    data={
                        "model_a": st.session_state.model1_name,
                        "model_b": st.session_state.model2_name,
                        "result": result,
                    },
                )
            )
            st.session_state.show_results = True
            st.rerun()

        if col4.button("👈 Left (A)"):
            vote(st.session_state.model1_name, "win")

        if col5.button("Right (B) 👉"):
            vote(st.session_state.model2_name, "loss")

        if col6.button("Both Good"):
            vote("both_good", "both_good")

        if col7.button("Both Bad"):
            vote("both_bad", "both_bad")

    game_no = asyncio.run(fetch_api("/total_games", method="GET"))
    if st.session_state.show_results:
        response_data = {
            "game_no": game_no,
            "query": st.session_state.user_input,
            "use_case": selected_option,
            "model_a": st.session_state.model1_name,
            "model_b": st.session_state.model2_name,
            "response_a": st.session_state.llm1_response,
            "response_b": st.session_state.llm2_response,
            "winner_model": st.session_state.winner,
        }
        asyncio.run(fetch_api("/add_response", method="POST", data=response_data))
        st.success("Response and rating added successfully!")

        with col1:
            st.write(f"Model A: {st.session_state.model1_name}")

        with col2:
            st.write(f"Model B: {st.session_state.model2_name}")

        for key in [
            "llm1_response",
            "llm2_response",
            "model1_name",
            "model2_name",
            "prompt1",
            "prompt2",
            "user_input",
            "show_results",
            "winner",
            "voting"
        ]:
            st.session_state[key] = ""
            st.session_state.voting = True
        st.rerun()

if __name__ == "__main__":
    main()
