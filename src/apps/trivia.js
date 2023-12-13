export default async function TriviaApp(url, metadata) {
	if (!url) url = "/"
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

	return `
  <CiscoIPPhoneText>
  <Title>Trivia</Title>
  </CiscoIPPhoneText>
  `;




}
