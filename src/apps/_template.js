import {App} from "../lib/app_scheme";

// TODO: #1 Duplicate this file and name it something memorable

//TODO: #2 Change `TestApp` to what the app is called, like `TriviaApp` or `MapApp`
export class TemplateApp extends App {
	// Now we can set the app metadata


	//TODO: #3 Change this to the user facing name of your app
	static name = "TemplateApp"
	// TODO: #4 Change this to the description of your app
	static description = "This is a template app"
	// TODO: #5 Change this to the version of your app
	static version = "1.0"
	// TODO: #6 Change this to the author of your app
	static author = "Quacksire"
	// TODO: #7 Change this to the path of your app, like `trivia` or `map`
	static path = "template"

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
				return this.TextScreen("App Template", `This is a template you can use to make your own Cisco IPPS\n\nSee https://ducks.win/ipps-template on how to make your own`, [
					{
						name: "back to app list",
						url: `http://${metadata.host}/main.xml`,
						position: 1
					},
					{
						name: "credits",
						url: `${this.rootURL}/credits`,
						position: 4
					}
				])

			// TODO: #8 Optional - Add more pages to your app, need to add a softkey or other type of link to get to/from it
			case `${this.path}/credits`: // Credits Page
				return this.showCredits(this.rootURL)


			default: // 404 Page
				return this.notFound(metadata)
		}
	}
}
// TODO: #9 Import your app in src/worker.js
// TODO: #10 Add your app to the array
// TODO: #11 Submit a PR
