import {App} from "../lib/app_scheme";

// TODO: #1 Duplicate this file and name it something memorable

//TODO: #2 Change `TestApp` to what the app is called, like `TriviaApp` or `MapApp`
export class TestApp extends App {
	// Now we can set the app metadata


	//TODO: #3 Change this to the user facing name of your app
	static name = "TestApp"
	// TODO: #4 Change this to the description of your app
	static description = "This is a test app"
	// TODO: #5 Change this to the version of your app
	static version = "1.0"
	// TODO: #6 Change this to the author of your app
	static author = "Quacksire"
	// TODO: #7 Change this to the path of your app, like `trivia` or `map`
	static path = "test"

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
				// TODO: #8 Make the app

			/**
			 * This is the home page of the app, it will be the first page the user sees when they select the app
			 * Make sure you maintain the indentation, it will make it easier to read and debug
			 */

			/**
			 * `this.TextScreen` is a function that will generate a CiscoIPPhoneText screen with a title, text, and enables use of soft keys
			 */

			// TODO: #8 Optional - Add more pages to your app, need to add a softkey or other type of link to get to/from it
			case `${this.path}/credits`: // Credits Page
				return this.showCredits(this.rootURL)


			default: // 404 Page
				return this.TextScreen("404", "This page does not exist", [
					{
						name: "Back",
						url: `${this.rootURL}`,
						position: 1
					}
				])
		}
	}
}
// TODO: #9 Import your app in src/worker.js
// TODO: #10 Add the desired path of the app to the conditional on line #46, following the standard that is already set
// TODO: #11 profit?
