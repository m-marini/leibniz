import React, { FunctionComponent } from "react";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";

export interface EditorProps {
    text: string,
    errorList?: [string, string[]][],
    onValidate?: (text: string) => void
}

/**
 * Renders the editor panel 
 */
export const TextPanel: FunctionComponent<EditorProps> = (props) => {
    const { text, errorList, onValidate } = props;
    return (
        <Form noValidate>
            <Form.Group className="mb-3" id="yam-text">
                <InputGroup>
                    <FloatingLabel label="Model text">
                        <Form.Control id='yaml-text-field'
                            as="textarea"
                            placeholder="Yaml"
                            value={text}
                            isValid={!errorList}
                            isInvalid={!!errorList}
                            onChange={ev => {
                                if (onValidate) {
                                    onValidate(ev.target.value);
                                }
                            }}
                            className="font-monospace"
                            style={{ height: '600px' }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errorList ? (
                                <dl>
                                    {errorList.map((errorItem, i) => (
                                        <>
                                            <dt>{errorItem[0]}</dt>
                                            <dd>
                                                <ul>{errorItem[1].map((text, j) => (
                                                    <li key={j}>{text}</li>
                                                ))}
                                                </ul>
                                            </dd>
                                        </>
                                    ))}
                                </dl>
                            ) : (
                                <></>
                            )}
                        </Form.Control.Feedback>
                    </FloatingLabel>
                </InputGroup>
            </Form.Group >
        </Form >
    );
}