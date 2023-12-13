export default async function TestApp(url, metadata) {
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
  <CiscoIPPhoneIconFileMenu>
<Title IconIndex="2">Conference List</Title>
<IconItem>
<Index>1</Index>
<URL>Resource:Icon.SecureCall</URL>
</IconItem>
<IconItem>
<Index>2</Index>
<URL>Resource:Icon.Connected</URL>
</IconItem>
<IconItem>
<Index>3</Index>
<URL>Resource:AnimatedIcon.Ringin</URL>
</IconItem>
<MenuItem>
<Name>Schmo, Joe</Name>
<IconIndex>1</IconIndex>
<URL>http://192.168.1.12:8080/details?user=jschmo</URL>
</MenuItem>
<MenuItem>
<Name>Blow, Joe</Name>
<IconIndex>2</IconIndex>
<URL>http://192.168.1.12:8080/details?user=jblow</URL>
</MenuItem>
<MenuItem>
<Name>Joining, Just Now</Name>
<IconIndex>3</IconIndex>
<URL>http://192.168.1.12:8080/details?user=jjoining</URL>
</MenuItem>
</CiscoIPPhoneIconFileMenu>
  `;


}
