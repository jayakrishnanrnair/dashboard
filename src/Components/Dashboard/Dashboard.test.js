import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

const MOCK_DATA = `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"
168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0"
168.41.191.41 - - [11/Jul/2018:17:41:30 +0200] "GET /this/page/does/not/exist/ HTTP/1.1" 404 3574 "-" "Mozilla/5.0"`;

test('If there are 3 boxes and total 9 table rows', async () => {
	jest.spyOn(global, 'fetch').mockImplementation(() =>
		Promise.resolve({
			text: () => Promise.resolve(MOCK_DATA),
		})
	);

	await act(async () => {
		render(<Dashboard />);
	});

	const boxElems = screen.getAllByTestId('dashboard_box');
	expect(boxElems).toHaveLength(3);

	const tableRowElems = screen.getAllByTestId('table_row');
	expect(tableRowElems).toHaveLength(9);
});
