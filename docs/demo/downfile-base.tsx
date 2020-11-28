import React, { useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';

import { DownFile } from '../../src/index';

export default () => {
	const downRef = useRef<DownFile | null>(null);

	useEffect(() => {
		downRef.current = new DownFile([]);
	}, []);

	const down = useCallback(() => {
		console.log(downRef.current);
	}, [downRef]);

	return (
		<Button type="primary" onClick={down}>
			Download
		</Button>
	);
};
