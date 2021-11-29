# Endpoint testing

<a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png" /></a>

> This is part of Academy's [technical curriculum for **The Mark**](https://github.com/WeAreAcademy/curriculum-mark). All parts of that curriculum, including this project, are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-nd/4.0/">Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License</a>.

We're now going to run your first server and play around with a few existing **endpoints** that it has.

## Learning Outcomes

- Compare the brittleness of different tests
- Write endpoint tests for an express server with `supertest`
- Use Jest's documentation on matchers
- Use Jest's `toMatch` matcher with a regular expression
- Load an environment variable from a `.env` file into Node

## Exercise 1: Installing, running and testing

**Success criterion:** you can view evidence your server is running at `localhost:4000` and run its tests (which should all pass)

Clone/fork the repo so that you have it locally, then view the `scripts` available in `package.json`. This should give you an idea of what you can run to get the server started, run its tests, and make queries via Postman.

(The server doesn't need to be running for you to run tests - [`supertest`](https://github.com/visionmedia/supertest) is a testing library that lets us test HTTP requests.)

## Exercise 2: Environment variables

> 🎯 **Success criterion:** you can view the effects of loading in your environment variables and articulate why a `.env` should not be tracked in git

In `index.ts` you'll see the following code:

```ts
// load .env file contents into process.env
dotenv.config();

// use either specified port number in .env or 4000
const PORT = process.env.PORT_NUMBER ?? 4000;
```

(The [nullish coalescing operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator) `??` happens to be used here, but that's an unimportant detail.)

`.env` is a file where it is common to store 'environment variables', which you can [read about here](https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786).

One of the important takeaways is **adding your `.env` to `.gitignore`** (which has been done for you in this example).

This is because `.env` files can contain _secrets_ which we don't want to risk exposing to the world.

We've included an example `.env` file as `.env.example` - rename this to simply `.env` and restart your server (needed to load the new environment variables).

You should see the two environment variables take effect in two ways:

1. the specified port number will be used
2. the specified message will be logged out on server start

Because we don't typically track `.env` in source control, it is common to include a sample file (such as `.env.example`, or `sample.env`) to show somebody how their local (untracked) `.env` file should look.

## Exercise 3: Reading, understanding and documenting

> 🎯 **Success criterion:** a document which outlines how you think this Express server works. You don't have to achieve a theory which explains 100%, but you should strive to explain as much as possible.

(N.B.: The _correctness_ of your theory is **much less important** than the _process_ of forming this document. [Forming a prediction, and then discovering it was wrong, is an effective way to learn](https://www.sciencedirect.com/science/article/abs/pii/S0959475217303468)!)

1. Take some time to read and digest the code
2. Google things that you don't understand
3. Experiment with changing things
4. Produce a narrative document

### A note on the tests

The tests have been written using a few different [Jest matchers](https://jestjs.io/docs/en/using-matchers).

We'll look at three different strategies for testing the content of `response.body.speech.text`.

**`GET /`**

By using `.toStrictEqual` on the response body, our test for `GET /` is the most _britle_. It's specific, prescriptive and rigid - it's easy for a non-meaningful change to break it.

A small punctuation change (e.g. "Hmm, I reckon we should have an exclamation mark rather than a full stop after 'ENDPOINT ADVENTURE'") requires a change in _two_ places: the test file _and_ the server file.

Additionally, the assertion (which checks the whole of `response.body`) will fail if we make a change to a different part of the body (e.g. `response.body.options`).

**`GET /quest/accept`**

In this test, we're using the below assertion:

```ts
expect(typeof response.body.speech.text).toBe("string");
```

we are only asserting that `response.body.speech.text` is a string - but it could be any string, e.g. the empty string `''` or a total non-sequitur like `"You have no authority here, Jackie Weaver!"`

This is far less brittle, but it also may be insufficiently stringent as a test.

**`GET /quest/decline`**

In this test, we're using the below assertions:

```ts
expect(response.body.speech.text).toMatch("FOOL");
expect(response.body.speech.text).toMatch(/mistake/i);
```

The first of these checks that `"FOOL"` appears somewhere in the string (but doesn't care where).

The second is using a [regular expression](https://eloquentjavascript.net/09_regexp.html), looking for the pattern `mistake` (enclosed within `/` to declare a [regular expression literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#creating_a_regular_expression)), with the `i` [flag](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags) added at the end to indicate a case-insensitive search: so `"MISTAKE"` and `"miSTakE"` both match.

(The equivalent `_RegExp_` for `"FOOL"` in our first assertion would have been `/FOOL/`, with no case insensitive flag - since the string `"FOOL"` is not a case insensitive matcher.)

These assertions are less brittle than testing for an exact string and also more stringent _and informative_ than simply checking it is a string. They communicate something about _intent_ by giving clues as to what sort of message should be represented in the string, without being prescriptive down to punctuation and phrases.

## Exercise 4: Writing and satisfying endpoint tests

> 🎯 **Success criterion:** your server passes the test for `GET /quest/start/impossible`, you have a passing test written for `GET /help`, and you have used TDD with `GET /quest/start/easy` and `GET /quest/start/hard`

**Pass the test for `/quest/start/impossible`**

There is currently a skipped test for `GET /quest/start/impossible`. Un-skip it, and write the route handler to make it pass.

**Write the test for `/help`**

There is currently a handler written for `GET /help`, but no associated test. Write a sensible test (making a judgement on stringency and brittleness) for it.

**TDD for `/quest/start/easy` and `/quest/start/hard`**

When the user accepts the quest (`GET /quest/accept`), they have three options presented to them. Currently, just one of these has a defined test and route handler.

Write the code for the remaining two routes, using TDD - starting with the tests and then progressing to the route handlers.

## Exercise 5: Further TDD endpoints

> 🎯 **Success criterion:** you have added at least three further endpoints using TDD with `supertest`

This takes us only to the start of the quest - there's no actual questing happening yet!

Let's remedy that - add at least three further endpoints using TDD.

## Exercise 6: Commentary and reflection

> 🎯 **Success criterion:** documented reflections.
