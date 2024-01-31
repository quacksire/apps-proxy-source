/**
 * CUCM IPPS App Source
 * ----------------------
 * Since CUCM phones may or may not support any type of TLS,
 * I have a proxy set on their network to forward their requests so that
 * I can use Cloudflare Workers
 *
 *  * Apps are in the `src/apps/` dir of this project
 *
 *  When adding an app:
 * 1. clone one of the files in that dir
 * 2. Modify it to your liking or purpose
 * 3. Import it like the examples on [lines #29-30]{@link worker.js:L29} in this file
 * 4. Add the desired path of the app to the conditional on line #46, following the standard that is already set
 * 5. profit?
 *
 * {@link https://ducks.win/cucm-phone-docs CUCM IPPS Response Docs}
 * {@author https://quacksire.dev}
 *
 */





// TODO: #9 - Import your app here
import { TestApp } from './apps/test'
import { TriviaApp } from './apps/trivia'
import { TemplateApp } from './apps/_template';

// TODO: #10 - Add your app to the array
const apps = [
	TemplateApp,
	TestApp,
	TriviaApp
]

export default {
	async fetch(request, env, ctx) {
		const { pathname, host } = new URL(request.url);
		const url = new URL(request.url);
		const queryParameters = url.searchParams;

		let metadata = {
			url: url,
			host: queryParameters.get("host") || host || "apps-proxy-source.quacksire.workers.dev",
			cucmPhone: queryParameters.get("x-ciscoipphonemodelname") || "N/A"
		}


		if (pathname.startsWith('/app/')) {
			let appRes
			let appDir = pathname.split('/app/')[1]

			// appDir.startsWith("appName")

			await apps.forEach(async (app) => {
				if (appDir.startsWith(app.path)) {
					appRes = await app.app(appDir, metadata)
				}
			})


			return new Response(appRes, { headers: { 'Content-Type': 'text/xml' } });
		}
		if (pathname.startsWith('/img/')) {
			let imgDir = pathname.split('/img/')[1]
			let img

			// appDir.startsWith("appName")
			if (imgDir.startsWith('profile')) {
				return fetch(`https://quacksire.dev/profile.png`)
				console.log(img.body)
			}


			return new Response(img.body, { headers: { 'Content-Type': 'image/png' } });
		}


		if (pathname === '/main.xml' || pathname === '/') {
			return new Response(await getMainXML(metadata.host), {
				headers: { 'Content-Type': 'text/xml' },
			});
		}

		if (pathname === '/caltrain.xml') {
			const xml = await getCaltrainXML(metadata.host);
			return new Response(xml, { headers: { 'Content-Type': 'text/json' } });
		}

		if (pathname.startsWith('/caltrain/') && pathname.endsWith('.xml')) {
			const stopId = pathname.substring('/caltrain/'.length, pathname.length - 4);

			if (stopId.length === 4) {
				// Handle direction selection
				const direction = stopId.endsWith('1') ? 'Northbound' : 'Southbound';
				const xml = await getCaltrainStopXML(metadata.host, stopId);
				return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
			}

			if (stopId === '253774') {
				// Handle special case for Stanford
				const xml = `
          <CiscoIPPhoneText>
            <Title>Stanford</Title>
            <Prompt>Sorry, no information available</Prompt>
            <Text>You're not going to Stanford</Text>
          </CiscoIPPhoneText>
        `;
				return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
			}
		}


		if (pathname === '/bart.xml') {
			const xml = await getBartXML(host);
			return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
		}

		if (pathname.startsWith('/bart/')) {
			const stopId = pathname.substring('/bart/'.length, pathname.length - 4);
			const xml = await getBartStopXML(host, stopId);
			return new Response(xml, { headers: { 'Content-Type': 'text/xml' } });
		}

		// Handle other routes or return a 404 response.
		return new Response('Not Found', { status: 404 });
	},
};

async function getMainXML(hostname) {
	let items = apps.map((app, index) => {
		return `
		<MenuItem>
			<Name>${app.name}</Name>
			<URL>http://${hostname}/app/${app.path}</URL>
			<IconIndex>${index}</IconIndex>
		</MenuItem>`
	})
	return `
    <CiscoIPPhoneMenu>
      <Title>Apps</Title>
      <Prompt></Prompt>
      ${items.join('')}
      <SoftKeyItem>
				<Name>Close</Name>
				<URL>Init:Services</URL>
				<Position>1</Position>
				</SoftKeyItem>
    </CiscoIPPhoneMenu>
  `;
}
async function getCaltrainXML(hostname) {
	const response = await fetch(`https://api.511.org/transit/stops?operator_id=CT&api_key=${apiKey}&format=json`,{
		headers : {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		}
	});
	const data = JSON.parse(JSON.stringify(await response.text()))

	const caltrainStops = data.Contents.dataObjects.ScheduledStopPoint;

	const menuItems = caltrainStops
		.filter((stop) => stop.Name.includes("Caltrain") && !stop.Name.includes("Shuttle"))
		.filter((stop) => stop.id.match(/^[0-9]+$/))
		.map((stop) => `
      <MenuItem>
        <Name>${stop.Name.replace('Caltrain Station', '')}</Name>
        <URL>http://${hostname}/caltrain/${stop.id}.xml</URL>
        <IconIndex>1</IconIndex>
      </MenuItem>
    `);

	return `
    <CiscoIPPhoneMenu>
      <Title>511</Title>
      <Prompt>Choose a Caltrain Station</Prompt>
      ${menuItems.join('')}
    </CiscoIPPhoneMenu>
  `;
}

async function getCaltrainStopXML(hostname, stopId) {
	const response = await fetch(`http://api.511.org/transit/StopMonitoring?api_key=${apiKey}&agency=CT&stopCode=${stopId}&format=json`);
	console.log(response)


	const stop = data.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit[0];
	//const eta = moment(new Date(Date.parse(stop.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime)).fromNow();

	return `
    <CiscoIPPhoneText>
      <Title>${stop.MonitoredVehicleJourney.DestinationName}</Title>
      <Prompt>ETA: ${eta}</Prompt>
      <Text>${stop.MonitoredVehicleJourney.LineRef} - ${eta}</Text>
    </CiscoIPPhoneText>
  `;
}

async function getBartXML(hostname) {
	const apiKey = 'your_api_key'; // Replace with your API key
	const response = await fetch(`https://api.511.org/transit/stops?operator_id=BA&api_key=${apiKey}&format=json`);
	const data = await response.json();

	const bartStops = data.Contents.dataObjects.ScheduledStopPoint;

	const menuItems = bartStops
		.filter((stop) => !stop.id.includes("_"))
		.map((stop) => `
      <MenuItem>
        <Name>${stop.Name}</Name>
        <URL>http://${hostname}/bart/${stop.id}.xml</URL>
        <IconIndex>1</IconIndex>
      </MenuItem>
    `);

	return `
    <CiscoIPPhoneMenu>
      <Title>511</Title>
      <Prompt>Choose a Bart Station</Prompt>
      ${menuItems.join('')}
    </CiscoIPPhoneMenu>
  `;
}

async function getBartStopXML(hostname, stopId) {
	const response = await fetch(`http://api.511.org/transit/StopMonitoring?api_key=${apiKey}&agency=BA&stopCode=${stopId}&format=json`);
	const data = await response.json();
	console.log(data)

	const stop = data.ServiceDelivery.StopMonitoringDelivery.MonitoredStopVisit[0];
	//const eta = moment(new Date(Date.parse(stop.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime)).fromNow();

	return `
    <CiscoIPPhoneText>
      <Title>${stop.MonitoredVehicleJourney.DestinationName}</Title>
      <Prompt>ETA: ${eta}</Prompt>
      <Text>${stop.MonitoredVehicleJourney.LineRef} - ${eta}</Text>
    </CiscoIPPhoneText>
  `;
}
