import {App} from "../lib/app_scheme";

export class TestApp extends App {
	// Now we can set the app metadata
	static name = "TestApp"
	static description = "This is a test app"
	static version = "1.0"
	static author = "Quacksire"
	static path = "test"
	rootURL = ''

	/**
	 * @name TestApp
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
				return this.TextScreen("TestApp", `This is a test app. Your ${metadata.cucmPhone} is pretty goofy`, [
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
			case `${this.path}/credits`: // Credits Page
				return this.showCredits(this.rootURL)


			default: // 404 Page
				return this.notFound(metadata)


		}
	}
}
