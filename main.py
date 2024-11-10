import subprocess
import json
import os
from pymongo import MongoClient
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

scripts = [
    {
        "path": r"breakfastData.js",
        "arguments": ["worcester", "hampshire", "berkshire", "franklin"]
    },
    {
        "path": r"lunchData.js",
        "arguments": ["worcester", "hampshire", "berkshire", "franklin"]
    },
    {
        "path": r"dinnerData.js",
        "arguments": ["worcester", "hampshire", "berkshire", "franklin"]

    },
    {
        "path": r"latenightData.js",
        "arguments": ["worcester", "hampshire"]
    },
    {
        "path": r"grabngoData.js",
        "arguments": ["worcester", "hampshire", "berkshire", "franklin"]
    }
]

mongo_uri = "mongodb+srv://rayanc2005:ulHWgFBlHBOfAhHR@hackumassxiii.xqyan.mongodb.net/?retryWrites=true&w=majority&appName=HackUMassXIII"

client = MongoClient(mongo_uri, server_api=ServerApi('1'))

db = client["HackUMassXIII"] 
collection = db["meal_data"] 

def run_node_script(script_path, args):
    script_dir = r"C:\Users\coold\Documents\GitHub\HackUMassXII\Dining-Data-Extracter"
    os.chdir(script_dir)

    subprocess.run(['node', script_path] + args,)
    meal_type = script_path.replace("Data.js", "").lower()
    file_path = f"../Dining Data/{args[0]}/{args[0]}_{meal_type}.json"

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            json_data = file.read()
            print(f"Read data from {file_path}")
            return json_data  
    except FileNotFoundError:
        print(f"Error: The file {file_path} was not found.")
        return None
        

def update_mongo(dining_hall, meal_time, data):
    # Clean any extra whitespace or invalid characters
    cleaned_data = data.strip()

    # Try parsing the JSON data
    try:
        # Convert the cleaned data (string) into a JSON object
        json_data = json.loads(cleaned_data)
        
        # Ensure json_data is a list of meals (for each meal type like breakfast, lunch, etc.)

            # Get the collection for the dining hall
        collection = db[dining_hall]

        # Update the document (add data under meal_time like breakfast, lunch, etc.)
        update_query = { "name": dining_hall }
        update_data = {
            "$set": { f"meals.{meal_time}": json_data }
        }

        # This will insert a new document if the dining hall doesn't exist
        collection.update_one(update_query, update_data, upsert=True)
        print(f"Updated {meal_time} for {dining_hall}.")

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON data: {e}")

def main():
    for dining_hall in ["worcester", "hampshire", "berkshire", "franklin"]:
        collection = db[dining_hall]
        collection.delete_many({})  # Remove all data from the dining hall collection

    for script in scripts:
        path = script["path"]
        for arg in script["arguments"]:
            print(f"Running Node.js script at {path} with argument {arg}...")
            script_output = run_node_script(path, [arg])
            
            if script_output:
                meal_time = path.replace("Data.js", "").lower()
                print(f"Updating MongoDB with data for {meal_time} at {arg}...")
                update_mongo(arg, meal_time, script_output)
            else:
                print(f"No output or error reading file for {path} with argument {arg}.")

if __name__ == "__main__":
    main()