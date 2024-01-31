import {App} from "../lib/app_scheme";

export class TriviaApp extends App {
	// Now we can set the app metadata


	static name = "Trivia"
	static description = "Test your knowledge with this trivia app."
	static version = "1.0"
	static author = "Quacksire"
	static path = "trivia"

	// <no-touchy>
	rootURL = ''
	// </no-touchy>


	/**
	 * @param url {string} - The URL path of the app
	 * @param metadata {object} - The metadata of the request
	 * @param metadata.url {URL} - The URL of the request
	 * @param metadata.host {string} - The host of the request
	 * @param metadata.cucmPhone {string} - The model name of the phone
	 * @returns {string}
	 * @constructor
	 */
	static async app(url, metadata) {
		this.setRootURL(metadata.host)


		// This switch statement is the page router, it will route the app to the correct page
		switch (url) { // Page Router


			case `${this.path}`: // Home Page

				/**
				 * This is the home page of the app, it will be the first page the user sees when they select the app
				 * Make sure you maintain the indentation, it will make it easier to read and debug
				 */

				return this.MenuScreen("Trivia", "Choose a difficulty", [
					{
						name: "Easy",
						url: `${this.rootURL}/game/easy`
					},
					{
						name: "Medium",
						url: `${this.rootURL}/game/medium`
					},
					{
						name: "Hard",
						url: `${this.rootURL}/game/hard`
					}
				], [
					{
						name: "Credits",
						url: `${this.rootURL}/credits`,
						position: 4
					},
					{
						name: "back to app list",
						url: `http://${metadata.host}/main.xml`,
						position: 1
					}
				])

			/**
			 * `this.TextScreen` is a function that will generate a CiscoIPPhoneText screen with a title, text, and enables use of soft keys
			 */


			case `${this.path}/credits`: // Credits Page
				return this.showCredits(this.rootURL)
			default: // 404 Page

				if (url.includes('/game/')) {
					// Game Pages
					/**
					 * /app/trivia/game/[difficulty] - question
					 * /app/trivia/game/[difficulty]/correct - correct answer screen with continue button and back to main menu button
					 * /app/trivia/game/[difficulty]/incorrect?correct_answer=[answer] - incorrect answer screen with correct answer and back to main menu button
					 */
					let difficulty = url.split('game/')[1].split('/')[0]
					console.log(difficulty)

					console.log(url)



					if (url === `trivia/game/${difficulty}/correct`) {
						return this.TextScreen(
							"Correct!",
							"You answered correctly!",
							[
								{
									name: "Main Menu",
									url: this.rootURL,
									position: 1
								},
								{
									name: "Next!",
									url: this.rootURL + '/game/' + difficulty,
									position: 4
								}
							])

					}
					if (url === `trivia/game/${difficulty}/incorrect`) {
						console.log(new URL(metadata.url).search)

						return this.TextScreen(
							"Incorrect",
							"You answered incorrectly. The correct answer was " + new URL(metadata.url).searchParams.get('answer'),
							[
								{
									name: "Main Menu",
									url: this.rootURL,
									position: 1
								},
								{
									name: "Next!",
									url: this.rootURL + '/game/' + difficulty,
									position: 4
								}
							])
					}


					//await this.waitforme(1000)

					let triviaURL = `https://opentdb.com/api.php?amount=1&category=18&type=multiple`
					let triviaResponse = await fetch(triviaURL)
					let trivia = (await triviaResponse.json()).results[0]
					/**
					 * Object {
					 *   type: string,
					 *   difficulty: string,
					 *   category: string,
					 *   question: string,
					 *   correct_answer: string
					 *   incorrect_answers: Array [String]
					 * }
					 */


					let positions = [1, 2, 3, 4]
					// shuffle positions in a random order
					positions = positions.sort(() => Math.random() - 0.5)

					let triviaAnswers = trivia.incorrect_answers
					triviaAnswers.push(trivia.correct_answer)
					// shuffle answers in a random order
					triviaAnswers = triviaAnswers.sort(() => Math.random() - 0.5)

					// create a map of position to answer
					let answersmapsXML = triviaAnswers.map((answer, index) => {
						return {
							name: `${answer}`,
							url: `${this.rootURL}/game/${difficulty}/${answer === trivia.correct_answer ? 'correct' : 'incorrect?answer=' + trivia.correct_answer}`,
							position: `${positions[index]}`
						}
					})
					// capitalize the first letter of the difficulty
					let difficultyCapitalized = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)

					return this.TextScreen(`${difficultyCapitalized} Question`, trivia.question, answersmapsXML)
				} else {
					// 404 Page
					return this.notFound(metadata)
				}
		}
	}
}
