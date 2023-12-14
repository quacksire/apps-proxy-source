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

	/**
	 * @name showCredits - Generates an CiscoIPPhoneText screen with the app credits
	 * @param rootURL - The root URL of the app
	 * @returns {string}
	 */
	static showCredits(rootURL) {
		return `
		<CiscoIPPhoneText>
			<Title>${this.name}</Title>
			<Text>
				Credits\n
				--------\n
				${this.description} v${this.version}\n
				Developed by ${this.author}
			</Text>
			<SoftKeyItem>
				<Name>Back</Name>
				<URL>${rootURL}</URL>
				<Position>1</Position>
			</SoftKeyItem>
		</CiscoIPPhoneText>`
	}

	/**
	 *
	 * @param host {string} - The host url
	 */
	static setRootURL(host) {
		this.rootURL = `http://${host}/app/${this.path}`
	}

}
