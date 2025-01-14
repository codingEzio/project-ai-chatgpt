'use client';
import { genetrateCopyButton } from '@/utils/helper';
import createLiveChatCompletion from '@/utils/liveGptClient';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { SetStateAction, useEffect, useRef, useState } from 'react';

marked.setOptions({
  langPrefix: 'hljs language-',
  highlight: function (code: any, lang: string) {
    return hljs.highlightAuto(code, [
      'html',
      'javascript',
      'python',
      'rust',
      'go',
    ]).value;
  },
});

export default function App({
  parseHTML = true,
  defaultDirection,
}: {
  parseHTML?: boolean;
  defaultDirection?: string;
}) {
  const [apiKey, setApiKey] = useState('');
  const [maxTokens, setMaxTokens] = useState('2048');
  const [direction, setDirection] = useState(
    defaultDirection
      ? defaultDirection
      : `From now on, I will give you code snippets, then
- paragraph 1: explain what it does in short yet concise technical explanation
- paragraph 2: same thing but using real-world analogy in happy tones with emojis

Also
- Use bullet points
- Between paragraph, there shall be two <br>s
- Answer in Simplified Chinese (be native)

Do not start unless I say so`,
  );
  const [question, setQuestion] = useState(`def main():
    pass
  `);
  const [answer, setAnswer] = useState('...');

  const [isLoading, setIsLoading] = useState(false);

  const resultRef = useRef('');

  const tailRef = useRef('');

  const storeApiKey = (e: { target: { value: SetStateAction<string> } }) => {
    setApiKey(e.target.value);
    localStorage.setItem('apiKey', String(e.target.value));
  };

  const handleSubmitPromptBtnClicked = () => {
    if (question !== '' && !isLoading) {
      setIsLoading(true);
      setAnswer('');

      const source = createLiveChatCompletion(
        apiKey,
        Number(maxTokens),
        direction,
        question,
      );

      source.addEventListener('message', (e: { data: string }) => {
        if (e.data != '[DONE]') {
          const payload = JSON.parse(e.data);
          if (
            Object.prototype.hasOwnProperty.call(
              payload.choices[0].delta,
              'content',
            )
          ) {
            const text = payload.choices[0].delta.content;

            if (text.includes('```')) {
              if (tailRef.current === '') {
                tailRef.current = '\n```';
              } else {
                tailRef.current = '';
              }
            }

            if (text === '`') {
              tailRef.current = '';
            }

            resultRef.current = resultRef.current + text;

            setAnswer(resultRef.current);
          }
        } else {
          source.close();
        }
      });

      source.addEventListener(
        'readystatechange',
        (e: { readyState: number }) => {
          if (e.readyState >= 2) {
            tailRef.current = '';
            setIsLoading(false);
            setTimeout(() => {
              genetrateCopyButton();
            }, 500);
          }
        },
      );

      source.stream();
    } else {
      alert('Please insert a prompt!');
    }
  };

  useEffect(() => {
    // Perform localStorage action
    const localKey = localStorage.getItem('apiKey');
    if (localKey) {
      setApiKey(localKey);
    }
  }, []);

  useEffect(() => {
    resultRef.current = answer;
  }, [answer]);

  return (
    <main className="container mx-auto max-w-lg xl:max-w-screen-xl px-4 pt-6">
      <div className="flex flex-col xl:flex-row xl:flex-wrap">
        <div className="basis-full">
          <h1 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Code Explainer
          </h1>
        </div>
        <div className="basis-full xl:basis-1/2 xl:pr-2">
          <div className="flex flex-row">
            <div className="basis-full">
              <label>
                <span className="text-xs font-semibold inline-block py-1 px-2 my-2 uppercase rounded text-teal-600 bg-teal-200 last:mr-0 mr-1">
                  OpenAI API Key
                </span>
                <input
                  className="resize-none h-8 xl:h-12 w-full px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                  name="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={storeApiKey}
                />
              </label>
            </div>
            {/* <div className="basis-1/4 pl-2">
            <label>
              <span className="text-xs font-semibold inline-block py-1 px-2 my-2 uppercase rounded text-yellow-600 bg-yellow-200 last:mr-0 mr-1">
                max_tokens
              </span>
              <input
                className="resize-none h-8 w-full px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
                name="maxTokens"
                type="text"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
            </label>
          </div> */}
          </div>
        </div>
        <div className="basis-full xl:basis-1/2  xl:pl-2">
          <label>
            <span className="text-xs font-semibold italic inline-block py-1 px-2 my-2 uppercase rounded text-red-600 bg-red-200 last:mr-0 mr-1">
              The Magic
            </span>
            <textarea
              className="resize-vertical h-12 w-full px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
              name="system"
              value={direction}
              onChange={e => setDirection(e.target.value)}
            />
          </label>
        </div>
        <div className="basis-full">
          <label>
            <span className="text-xs font-semibold italic inline-block py-1 px-2 my-2 uppercase rounded text-blue-600 bg-blue-200 last:mr-0 mr-1">
              The Code
            </span>
            <textarea
              className="resize-none font-mono h-56 xl:h-24 w-full px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm"
              name="user"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </label>
        </div>
        <div className="basis-full">
          <button
            disabled={isLoading}
            className={
              isLoading
                ? 'w-full px-6 py-2 my-2 text-gray-700 border border-b-4 border-r-4 border-gray-500 hover:bg-gray-500 hover:text-gray-100 rounded-lg shadow-lg'
                : 'w-full px-6 py-2 my-2 text-indigo-700 border border-b-4 border-r-4 border-indigo-500 hover:bg-indigo-500 hover:text-indigo-100 rounded-lg shadow-lg'
            }
            onClick={handleSubmitPromptBtnClicked}
          >
            {isLoading ? `Loading...` : `Submit`}
          </button>
        </div>
        <div className="basis-full">
          <label>
            <span className="text-xs font-semibold inline-block py-1 px-2 my-2 uppercase rounded text-slate-600 bg-slate-200 last:mr-0 mr-1">
              Assistant
            </span>
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="overflow-auto h-56 xl:h-96 w-full xl:w-2/4 px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm">
                {parseHTML ? (
                  <div
                    className="flex flex-col"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(answer + tailRef.current),
                    }}
                  />
                ) : (
                  <div className="flex flex-col">{answer}</div>
                )}
              </div>
              <div className="overflow-auto h-56 xl:h-96 xl:w-2/4 px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-lg shadow-lg hover:shadow-sm">
                {parseHTML ? (
                  <div
                    className="flex flex-col"
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(answer + tailRef.current),
                    }}
                  />
                ) : (
                  <div className="flex flex-col">{answer}</div>
                )}
              </div>
            </div>
          </label>
        </div>
      </div>
    </main>
  );
}
