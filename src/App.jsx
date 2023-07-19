import { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/typescript";
import "ace-builds/src-noconflict/ext-language_tools";
import { Language } from './components/Language';


export const App = () => {
	const [code, setCode] = useState('');
	const [output, setOutput] = useState('');
	const [languages, setLanguages] = useState([{ name: 'Loading', compiler: [{ name: 'Loading' }] }]);
	const [languageSelected, setLanguageSelected] = useState({ name: 'Loading', compiler: [{ type: 'single', name: 'Loading' }] });
	const [compilerSelected, setCompilerSelected] = useState({ type: 'single', name: 'Loading' });

	const getList = async () => {
		const data = await fetch('https://wandbox.org/api/list.json').then(res => res.json());

		const groupedByAge = data.reduce((acc, obj) => {
			const key = obj['language'];
			const index = acc.findIndex(group => group['name'] === key);
			if (index === -1) {
				acc.push({ name: key, compiler: [obj] });
			} else {
				acc[index]['compiler'].push(obj);
			}
			return acc;
		}, []);
		setLanguages(groupedByAge);
	}

	useEffect(() => {
		getList();
	}, [])


	const handleRunCode = async () => {
		try {
			const response = await fetch('https://wandbox.org/api/compile.json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					code,
					compiler: compilerSelected.name,
				}),
			});
			const result = await response.json();
			console.log(result);
			setOutput(result.program_output);

		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			<header style={{ display: 'flex' }}>
				<Language languages={languages} languageSelected={languageSelected} setLanguageSelected={setLanguageSelected} compilerSelected={compilerSelected} setCompilerSelected={setCompilerSelected}/>
				<button onClick={handleRunCode}>Ejecutar</button>
			</header>
			<div style={{height: 'calc(100% - 2.5rem)', width:'100%', display: 'flex'}}>
				<AceEditor
					placeholder="Placeholder Text"
					mode={languageSelected.name.toLowerCase()}
					theme="monokai"
					name="blah2"
					onChange={setCode}
					fontSize={14}
					showPrintMargin={false}
					showGutter={true}
					highlightActiveLine={true}
					setOptions={{
						useWorker: false,
						enableBasicAutocompletion: true,
						enableLiveAutocompletion: true,
						enableSnippets: true,
						showLineNumbers: true,
						tabSize: 2,
					}}
					style={{ width: '60%', height: '100%' }} />
				
				<pre>{output ? output : '...'}</pre>
			</div>
		</>
	);
}
