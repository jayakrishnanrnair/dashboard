import { useState, useEffect } from 'react';
import taskLog from '../../logs/programming-task-example-data.log';
import './Dashboard.css';

const Dashboard = () => {
	const [uniqueIpsList, setUniqueIpsList] = useState([]);
	const [activeIpsList, setActiveIpsList] = useState([]);
	const [mostVisitedUrlsList, setMostVisitedUrlsList] = useState([]);

	/**
	 * Fetch data from the imported log file, reads it as text and calls the parse function.
	 */
	const fetchLogData = () => {
		fetch(taskLog)
			.then((response) => response.text())
			.then((data) => {
				parseLog(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	/**
	 * Loop through Object entries and sort entries array in order of the count and then pick the first 3 keys (with most count).
	 * @param {Object} data - Object which contains individual keys and it's corresponding count
	 * @returns - Array of keys
	 */
	const findTop3 = (data) => {
		return Object.entries(data)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 3)
			.map((itm) => itm[0]);
	};

	/**
	 * Traverse through the text from log file and set the state with:
	 * 1) The number of unique IP addresses.
	 * 2) The top 3 most visited URLs.
	 * 3) The top 3 most active IP addresses.
	 * Sample data:
	 * 177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
	 * @param {string} data - Text data which was read from the log file.
	 */
	const parseLog = (data) => {
		// Reads each line and creates an array of string
		const logEntries = (data || '').split('\n').filter((itm) => !!itm);

		const { uniqueIps, ipCounts, urlsCounts } = logEntries.reduce(
			(accu, curr) => {
				// Splits into 2 parts, where first part will be IP address.
				const logSplit_1 = curr.split(' - ');

				// Splits the next part again to rach the URL.
				const logSplit_2 = (logSplit_1[1] || '').split('] "');
				const logSplit_3 = (logSplit_2[1] || '').split('"');

				const ipValue = logSplit_1[0];
				const urlValue = logSplit_3[0].split(' ')[1] || '';
				const { uniqueIps, ipCounts, urlsCounts } = accu;

				// Push if the IP address is not already presnt in the existing IPs array.
				if (!uniqueIps.includes(ipValue)) accu.uniqueIps.push(ipValue);

				// If already an entry for the key is present in the object, increment it's count.
				// Else create a new entry with that key and count as 1.
				accu.ipCounts[ipValue] = ipCounts[ipValue] ? ipCounts[ipValue] + 1 : 1;
				accu.urlsCounts[urlValue] = urlsCounts[urlValue] ? urlsCounts[urlValue] + 1 : 1;

				return accu;
			},
			{ uniqueIps: [], ipCounts: {}, urlsCounts: {} }
		);

		// State update
		setUniqueIpsList(uniqueIps);
		setActiveIpsList(findTop3(ipCounts));
		setMostVisitedUrlsList(findTop3(urlsCounts));
	};

	/**
	 * Creates a table structure with rows corresponding to the data available.
	 * @param {string[]} data - Data that has to be displayed in the table.
	 * @returns - HTML content for table.
	 */
	const generateTableContent = (data) => {
		return (
			<div className='tableContainer'>
				{data.length > 0 ? (
					data.map((itm, index) => (
						<div key={`${itm}-${index}`} className='tableRow' data-testid='table_row'>
							<div className='tableCell' title={itm}>
								{itm}
							</div>
						</div>
					))
				) : (
					<div className='tableRow'>
						<div className='tableCell tableError' title='No Data Available'>
							No Data Available
						</div>
					</div>
				)}
			</div>
		);
	};

	useEffect(() => {
		fetchLogData();
	}, []);

	return (
		<div className='container flex-col'>
			<h1 className='title'>Dashboard</h1>
			<div className='boxContainer'>
				<div className='box flex-col' data-testid='dashboard_box'>
					<div className='boxTitle'>
						<h3 className='title'>Unique IP Address</h3>
					</div>
					{generateTableContent(uniqueIpsList)}
				</div>
				<div className='box flex-col' data-testid='dashboard_box'>
					<div className='boxTitle'>
						<h3 className='title'>Active IP Addresses</h3>
					</div>
					{generateTableContent(activeIpsList)}
				</div>
				<div className='box flex-col' data-testid='dashboard_box'>
					<div className='boxTitle'>
						<h3 className='title'>Most Visited URLs</h3>
					</div>
					{generateTableContent(mostVisitedUrlsList)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
