from flask import Flask, jsonify, render_template, request
import time
import os
from flask_cors import CORS
from updated_processing import *
import traceback
import time

app = Flask(__name__)
# Configure CORS to allow requests from your Next.js app
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Get the current directory where the Python script is running
script_dir = os.path.dirname(os.path.abspath(__file__))
# Target path: uploads/files/recorded.wav relative to the script location
save_dir = os.path.join(script_dir, 'uploads')
os.makedirs(save_dir, exist_ok=True)


# Initialize conversation history
conversation_history = []

@app.route('/')
def index():
    """Serve the UI"""
    return render_template('index_latest.html')



def conversation_loop_new(file_path): 
    # print("Customer Care Agent is ready to assist you. Speak now. Say 'exit' to end the conversation.")
    print("Cred Agent is happy to help you , please let me know your query .")
    
    latencies = {}

    # 1. Get the audio transcription
    start = time.time()
    text = send_audio_to_server_new(file_path)
    latencies['send_audio_to_asr_server'] = time.time() - start

    if not text:
        print("Didn't catch that. Please speak again...")
        return {"user_input": None, "ai_response": "Could not understand input."}

    print(f"User said: {text}")

    # 2. Exit condition check (no timing needed)
    if text.strip().lower() == "exit":
        farewell = "Thank you for reaching out to CRED. Have a great day!"
        print(f"Agent: {farewell}")
        return {"user_input": text, "ai_response": farewell}

    # 3. First interaction check/response
    if not conversation_history:
        start = time.time()
        first_agent_response = "Good morning, thank you for contacting CRED-Help. How can I assist you today?"
        conversation_history.append({"user": "Hello", "agent": first_agent_response})

    # 4. Generate AI response
    start = time.time()
    response = query_cred_chat_api(text)
    latencies['generate_response_Rag(AI)_Response'] = time.time() - start

    print(f"Agent: {response}")

    # 5. Update conversation history
    start = time.time()
    conversation_history.append({"user": text, "agent": response})

    # 6. Synthesize and play audio
    start = time.time()
    synthesize_and_play_audio(response)
    latencies['synthesize_and_play_audio_TTS'] = time.time() - start

    # Print latencies
    print("\n--- Latency Report ---")
    for func_name, duration in latencies.items():
        print(f"{func_name}: {duration:.3f} seconds")
    print("----------------------\n")

    # Return the result as a dictionary
    return {"user_input": text, "ai_response": response}


@app.route('/converse', methods=['POST'])
def converse():
    try:
        print("Request received at /converse")

        audio = request.files.get('file')
        if not audio:
            print("No file in request")
            return jsonify({"error": "No audio file received"}), 400

        print(f"Received file: {audio.filename}")
        # uploads_dir = os.path.join(PROJECT_ROOT, 'uploads')
        # os.makedirs(uploads_dir, exist_ok=True)  # Ensure uploads folder exists

        save_path = os.path.join(save_dir, audio.filename)
        audio.save(save_path)
        print(f"Saved file to {save_path}")

        # threading.Thread(target=conversation_loop, args=(save_path,)).start()
        result = conversation_loop_new(save_path)
        return result, 200

    except Exception as e:
        print("Error during /converse:", e)
        traceback.print_exc()  # Shows full error in the server logs
        return jsonify({"error": str(e)}), 500

greeting_played = False
@app.route("/greet", methods=["GET"])
def greet_user():
    global greeting_played
    if not greeting_played:
        # greeting = "Customer Care Agent is ready to assist you. Speak now. Say 'exit' to end the conversation."
        greeting = "Cred Agent is happy to help you , please let me know your query ."
        synthesize_and_play_audio(greeting)
        print(greeting)
        # greeting_played = True
        return jsonify({"greeting": greeting})
    else:
        return jsonify({"greeting": None})


if __name__ == "__main__":
    app.run(debug=True)
