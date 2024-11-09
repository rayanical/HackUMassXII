const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const hall = process.argv[2];
    // Launch the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the webpage

    await page.goto(`https://umassdining.com/locations-menus/${hall}/menu`); // Replace with your actual URL

    // Extract data
    const data = await page.evaluate(() => {
        const allData = {};

        /*
        // Extract data for breakfast if the breakfast div is present
        const breakfastDiv = document.querySelector('.breakfast_fp');
        if (breakfastDiv) {
            const breakfastElements = Array.from(breakfastDiv.querySelectorAll('.lightbox-nutrition'));
            const breakfastData = breakfastElements.map((foodElement) => {
                const element = foodElement.querySelector('a');
                const servingSize = element ? element.getAttribute('data-serving-size') : '';
                const calories = element ? element.getAttribute('data-calories') : '';
                const total_fat = element ? element.getAttribute('data-total-fat') : '';
                const total_carbohydrates = element ? element.getAttribute('data-total-carb') : '';
                const protein = element ? element.getAttribute('data-protein') : '';

                return {
                    name: foodElement.textContent.trim(),
                    serving_size: servingSize.trim(),
                    calories: calories.trim(),
                    total_fat: total_fat.trim(),
                    total_carbohydrates: total_carbohydrates.trim(),
                    protein: protein.trim(),
                };
            });

            allData.breakfast = breakfastData;
        }
        /*
        
        // Extract data for lunch if the lunch div is present
        const lunchDiv = document.querySelector('.lunch_fp');
        if (lunchDiv) {
            const lunchElements = Array.from(lunchDiv.querySelectorAll('.lightbox-nutrition'));
            const lunchData = lunchElements.map((foodElement) => {
                const element = foodElement.querySelector('a');
                const servingSize = element ? element.getAttribute('data-serving-size') : '';
                const calories = element ? element.getAttribute('data-calories') : '';
                const total_fat = element ? element.getAttribute('data-total-fat') : '';
                const total_carbohydrates = element ? element.getAttribute('data-total-carb') : '';
                const protein = element ? element.getAttribute('data-protein') : '';

                return {
                    name: foodElement.textContent.trim(),
                    serving_size: servingSize.trim(),
                    calories: calories.trim(),
                    total_fat: total_fat.trim(),
                    total_carbohydrates: total_carbohydrates.trim(),
                    protein: protein.trim(),
                };
            });

            allData.lunch = lunchData;
        }

        */
        // Extract data for dinner if the dinner div is present
        const dinnerDiv = document.querySelector('.dinner_fp');
        if (dinnerDiv) {
            const dinnerElements = Array.from(dinnerDiv.querySelectorAll('.lightbox-nutrition'));
            const dinnerData = dinnerElements.map((foodElement) => {
                const element = foodElement.querySelector('a');
                const servingSize = element ? element.getAttribute('data-serving-size') : '';
                const calories = element ? element.getAttribute('data-calories') : '';
                const total_fat = element ? element.getAttribute('data-total-fat') : '';
                const total_carbohydrates = element ? element.getAttribute('data-total-carb') : '';
                const cholesterol = element ? element.getAttribute('data-cholesterol') : '';
                const sodium = element ? element.getAttribute('data-sodium') : '';
                const sugar = element ? element.getAttribute('data-sugars') : '';
                const fiber = element ? element.getAttribute('data-dietary-fiber') : '';
                const protein = element ? element.getAttribute('data-protein') : '';
                const ingredients = element ? element.getAttribute('data-ingredient-list') : '';
                const allergens = element ? element.getAttribute('data-allergens') : '';
                const diet = element ? element.getAttribute('data-clean-diet-str') : '';

                return {
                    name: foodElement.textContent.trim().replace(/(\$|)0\.00$/, ''),
                    serving_size: servingSize.trim(),
                    calories: calories.trim(),
                    total_fat: total_fat.trim(),
                    total_carbohydrates: total_carbohydrates.trim(),
                    cholesterol: cholesterol.trim(),
                    sodium: sodium.trim(),
                    sugar: sugar.trim(),
                    fiber: fiber.trim(),
                    protein: protein.trim(),
                    ingredients: ingredients.trim(),
                    allergens: allergens.trim(),
                    diet: diet.trim(),
                };
            });

            allData.dinner = dinnerData;
        }

        /*
        // Extract data for grabngo if the grabngo div is present
        const grabngoDiv = document.querySelector('.grabngo');
        if (grabngoDiv) {
            const grabngoElements = Array.from(grabngoDiv.querySelectorAll('.lightbox-nutrition'));
            const grabngoData = grabngoElements.map((foodElement) => {
                const element = foodElement.querySelector('a');
                const servingSize = element ? element.getAttribute('data-serving-size') : '';
                const calories = element ? element.getAttribute('data-calories') : '';
                const total_fat = element ? element.getAttribute('data-total-fat') : '';
                const total_carbohydrates = element ? element.getAttribute('data-total-carb') : '';
                const protein = element ? element.getAttribute('data-protein') : '';

                return {
                    name: foodElement.textContent.trim(),
                    serving_size: servingSize.trim(),
                    calories: calories.trim(),
                    total_fat: total_fat.trim(),
                    total_carbohydrates: total_carbohydrates.trim(),
                    protein: protein.trim(),
                };
            });

            allData.grabngo = grabngoData;
        }

        // Extract data for late night if the latenight div is present
        const latenightDiv = document.querySelector('.latenight_fp');
        if (latenightDiv) {
            const latenightElements = Array.from(latenightDiv.querySelectorAll('.lightbox-nutrition'));
            const latenightData = latenightElements.map((foodElement) => {
                const element = foodElement.querySelector('a');
                const servingSize = element ? element.getAttribute('data-serving-size') : '';
                const calories = element ? element.getAttribute('data-calories') : '';
                const total_fat = element ? element.getAttribute('data-total-fat') : '';
                const total_carbohydrates = element ? element.getAttribute('data-total-carb') : '';
                const protein = element ? element.getAttribute('data-protein') : '';

                return {
                    name: foodElement.textContent.trim(),
                    serving_size: servingSize.trim(),
                    calories: calories.trim(),
                    total_fat: total_fat.trim(),
                    total_carbohydrates: total_carbohydrates.trim(),
                    protein: protein.trim(),
                };
            });

            allData.latenight = latenightData;
        }
        
        */
        return allData;
    });

    // Close the browser
    await browser.close();

    // Store data in a JSON file
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(`../Dining Data/${hall}/${hall}_dinner.json`, jsonContent);

    console.log('Data extracted and stored in output.json');
})();
