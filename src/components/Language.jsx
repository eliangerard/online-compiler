import { useEffect, useRef, useState } from "react";

export const Language = ({ languages, languageSelected, setLanguageSelected, compilerSelected, setCompilerSelected }) => {
    const inputLanguage = useRef(null);

    useEffect(() => {
        setLanguageSelected(languages[0]);
        console.log(languages[0].compiler[0]);
    }, [languages]);

    useEffect(() => {
        console.log(languageSelected);
        setCompilerSelected(languageSelected.compiler[0]);
    }, [languageSelected]);


    useEffect(() => {
        console.log(languageSelected);
    }, [languageSelected])

    const handleOptionChange = (event) => {
        console.log(event.target.value);
        setLanguageSelected(languages[event.target.value]);
    }

    return (
        <>
            <select ref={inputLanguage} name="language" id="" onChange={handleOptionChange}>
                {languages.map((language, index) => <option key={index} value={index}>{language.name}</option>)}
            </select>
            {
                languageSelected?.compiler?.length > 0 &&
                <select>
                    {languageSelected.compiler.map((option, index) => {
                        return <option key={'com' + index} value={option.name}>{option.name}</option>
                    })
                    }
                </select>
            }
            {
                compilerSelected?.switches?.length > 0 && <div>
                    {compilerSelected.switches.map((option, index) => {
                        if (option.type === 'single') {
                            return <label key={'op' + index}><input type="checkbox" id="cbox1" value={index} /> {option.name}</label>
                        }

                        if (option.type === 'select') {
                            return <select key={'sel'+index} name="options1" id="">
                                {option.options.map((option, index) => <option key={'op' + index} value={option.name}>{option.name}</option>)}
                            </select>
                        }
                    })
                    }
                </div>
            }
        </>
    )
}
