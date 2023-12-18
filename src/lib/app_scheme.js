export class App {
	static name = "Apps"
	static description = "This in an App"
	static version = "1.0"
	static author = "Quacksire"
	// apps/[path]
	static path = 'demo'
	rootURL = ''

	/**
	 * @name TextScreen
	 * @description Generates an CiscoIPPhoneText screen with a title, text, and softkeys
	 * @param title {string}
	 * @param text {string}
	 * // optional button
	 * @param keys {Array<{name: string, url: string, position: number}>
	 *   name - The name of the softkey
	 *   url - The URL of the softkey
	 *   position - The position of the softkey
	 * @returns {string}
	 * @constructor
	 */
	static TextScreen(title, text, keys = []) {
		return `
			<CiscoIPPhoneText>
			<Title>${this.name}</Title>
			<Text> ${text} </Text>
			<Prompt>${title}</Prompt>
			${keys.length >= 0 && keys.map(key => {
			return `
				<SoftKeyItem>
				<Name>${key.name}</Name>
				<URL>${key.url}</URL>
				<Position>${key.position}</Position>
				</SoftKeyItem>
			`
			}).join('')}
			</CiscoIPPhoneText>
`
	}

	static MenuScreen(prompt, title, items = [], softkeys = []) {
		return `
		<CiscoIPPhoneMenu>
			<Title>Trivia</Title>
			<Prompt>${title}</Prompt>
			${items.length >= 0 && items.map(item => {
			return `
				<MenuItem>
					<Name>${item.name}</Name>
					<URL>${item.url}</URL>
				</MenuItem>
			`
		}).join('')}
			${softkeys.length >= 0 && softkeys.map(key => {
			return `
				<SoftKeyItem>
				<Name>${key.name}</Name>
				<URL>${key.url}</URL>
				<Position>${key.position}</Position>
				</SoftKeyItem>
			`
		}).join('')}
		</CiscoIPPhoneMenu>`
	}

	/**
	 * @name showCredits - Generates an CiscoIPPhoneText screen with the app credits
	 * @param rootURL - The root URL of the app
	 * @returns {string}
	 */
	static showCredits(rootURL) {

		return this.TextScreen(
			"Credits",
			`Developed by ${this.author}\nVersion ${this.version}\n${this.description}`,
			[
				{
					name: "Back",
					url: `${rootURL}`,
					position: 1
				}
			])
	}

	/**
	 *
	 * @param host {string} - The host url
	 */
	static setRootURL(host) {
		this.rootURL = `http://${host}/app/${this.path}`
	}

	static waitforme(millisec) {
		return new Promise(resolve => {
			setTimeout(() => { resolve('') }, millisec);
		})
	}


	/**
	 * @name notFound - Generates an CiscoIPPhoneText screen with a 404 error
	 * @param metadata - The metadata of the request, needed to get the host and the root of the selected app
	 * @returns {string}
	 */
	static notFound(metadata) {
		return this.TextScreen("404", "This page does not exist", [
			{
				name: "Back",
				url: `${metadata.host}`,
				position: 1
			}])
	}

	/**
	 * @name appChooserLink - Generates a link to the app chooser
	 * @param metadata - The metadata of the request, needed to get the host and the root of the selected app
	 * @returns {string}
	 */
	static appChooserLink(metadata) {
		return `http://${metadata.host}/main.xml`
	}

	/**
	 * @name appChooserSoftKey - Generates a softkey to the app chooser
	 * @param metadata
	 * @param position
	 * @returns {{name: string, position, url: string}}
	 */
	static appChooserSoftKey(metadata, position = 0) {
		return {
			name: "Back",
			url: this.appChooserLink(metadata),
			position: position
		}

	}

}
