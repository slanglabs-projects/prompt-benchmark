import streamlit as st
from streamlit_option_menu import option_menu
import sys
import os

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def main():
    st.set_page_config(page_title="ELO Scoring Platform", layout="wide")

    with st.sidebar:
        selected = option_menu("Navigation", ["ELO Scoring Platform", "Leaderboard"],
                               icons=["house", "trophy"], menu_icon="cast", default_index=0)

    if selected == "ELO Scoring Platform":
        from client1.app import main as app_main
        app_main()
    elif selected == "Leaderboard":
        from client1.leaderboard import main as leaderboard_main
        leaderboard_main()
    elif selected == "Admin panel":
        from client1.admin import main as admin_main
        admin_main()

if __name__ == "__main__":
    main()
