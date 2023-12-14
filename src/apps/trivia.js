export default async function TriviaApp(url, metadata) {
	if (!url) url = "/"
	const rootURL = `http://${metadata.host}/app/trivia/`
	const name = "Trivia"
	const description = "Test your knowledge with this trivia app."
	// url = App URL
	// metadata.url =  Full URL
	//
	/*
	* let metadata = {
		url: url,
		host: queryParameters.get("host") || "apps-proxy-source.quacksire.workers.dev",
		cucmPhone: queryParameters.get("x-ciscoipphonemodelname") || "N/A"
	}
	*
	* */

	console.log(url, metadata)


	function showCredits() {
		return `
		<CiscoIPPhoneText>
			<Title>${name}</Title>
			<Text>
				${description}\n
				Developed by Quacksire (sam@quacksire.dev)
			</Text>
			<SoftKeyItem>
				<Name>Back</Name>
				<URL>${rootURL}</URL>
				<Position>1</Position>
			</SoftKeyItem>
		</CiscoIPPhoneText>`
	}

	/**
	 * @name TextScreen
	 * @description Generates an CiscoIPPhoneText screen with a title, text, and softkeys
	 * @param title {string}
	 * @param text {string}
	 * @param keys {Array<{name: string, url: string, position: number}>
	 * @returns {string}
	 * @constructor
	 */
	function TextScreen(title, text, keys) {
		return `
		<CiscoIPPhoneText>
			<Title>Trivia</Title>
			<Prompt>${title}</Prompt>
			<Text>
				${text}
			</Text>
			${keys.map(key => {
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




	// http://${metadata.host}/app/test.xml
	if (url === "credits") showCredits()

	if (url === "/") {
		return `
		<CiscoIPPhoneMenu>
			<Title>Trivia</Title>
				<MenuItem>
					<Name>Easy</Name>
					<URL>http://${metadata.host}/app/trivia/game/easy</URL>
				</MenuItem>
				<MenuItem>
					<Name>Medium</Name>
					<URL>http://${metadata.host}/app/trivia/game/medium</URL>
				</MenuItem>
				<MenuItem>
					<Name>Hard</Name>
					<URL>http://${metadata.host}/app/trivia/game/hard</URL>
				</MenuItem>
				<SoftKeyItem>
					<Name>Credits</Name>
					<URL>http://${metadata.host}/app/trivia/credits</URL>
					<Position>1</Position>
				</SoftKeyItem>
		</CiscoIPPhoneMenu>
		`;
	}
	if (url === "start") {
		// choose difficulty
		return `
		<CiscoIPPhoneMenu>
			<Title>Trivia</Title>
				<MenuItem>
					<Name>Easy</Name>
					<URL>http://${metadata.host}/app/trivia/game/easy</URL>
				</MenuItem>
				<MenuItem>
					<Name>Medium</Name>
					<URL>http://${metadata.host}/app/trivia/game/medium</URL>
				</MenuItem>
				<MenuItem>
					<Name>Hard</Name>
					<URL>http://${metadata.host}/app/trivia/game/hard</URL>
				</MenuItem>
		</CiscoIPPhoneMenu>
		`;
	}

	/*
	* /app/trivia/game/[difficulty] - question
	* /app/trivia/game/[difficulty]/correct - correct answer screen with continue button and back to main menu button
	* /app/trivia/game/[difficulty]/incorrect?correct_answer=[answer] - incorrect answer screen with correct answer and back to main menu button
	 */


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


	if (url.startsWith('game')) {
		let difficulty = url.split('game/')[1].split('/')[0]
		console.log(difficulty)


		if (url.endsWith('correct')) {
			return TextScreen(
				"Correct!",
				"You answered correctly!",
				[
					{
						name: "Main Menu",
						url: rootURL,
						position: 1
					},
					{
						name: "Next!",
						url: rootURL + 'game/' + difficulty,
						position: 4
					}
				])

		}
		if (url.endsWith('incorrect')) {
			console.log(new URL(metadata.url).search)

			return TextScreen(
				"Incorrect",
				"You answered incorrectly. The correct answer was " + new URL(metadata.url).searchParams.get('answer'),
				[
					{
						name: "Main Menu",
						url: rootURL,
						position: 1
					},
					{
						name: "Next!",
						url: rootURL + 'game/' + difficulty,
						position: 4
					}
				])
		}




		let triviaURL = `https://opentdb.com/api.php?amount=1&category=18&type=multiple`
		let triviaResponse = await fetch(triviaURL)
		let trivia = (await triviaResponse.json()).results[0]

		let positions = [1,2,3,4]
		// shuffle positions in a random order
		positions = positions.sort(() => Math.random() - 0.5)

		let triviaAnswers = trivia.incorrect_answers
		triviaAnswers.push(trivia.correct_answer)
		// shuffle answers in a random order
		triviaAnswers = triviaAnswers.sort(() => Math.random() - 0.5)

		// create a map of position to answer
		let answersmapsXML = triviaAnswers.map((answer, index) => {
			return `
			<SoftKeyItem>
				<Name>${answer}</Name>
				<URL>http://${metadata.host}/app/trivia/game/${difficulty}${answer === trivia.correct_answer ? '/correct' : '/incorrect?answer=' + encodeURI(trivia.correct_answer)}</URL>
				<Position>${positions[index]}</Position>
			</SoftKeyItem>
			`
		})



		return `
    <CiscoIPPhoneText>
      <Title>Trivia</Title>
      <Prompt>${trivia.question}</Prompt>
      <Text>${trivia.correct_answer}</Text>
      			${answersmapsXML.join('')}
    </CiscoIPPhoneText>
  `;

	}

	//




}
