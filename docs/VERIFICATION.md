# Demo verification — October 29, 2026

## Scope

The release adds a browser-based learning companion with eight curated examples, lesson search/filtering, local progress, example downloads, deterministic linear regression, CSV export, and original Matplotlib exports. It does not execute Python/R or publish the original notebook/dataset collection.

## Automated verification

`cd web && node --test tests/model.test.js`: **6 passed, 0 failed**.

- Known exact line: slope 2, intercept 1, R² 1, RMSE 0.
- Negative slope with no noise.
- Constant target: R² shown as N/A.
- Invalid and degenerate inputs rejected.
- 18 combinations of slope/noise/sample-count boundaries: finite fit, deterministic data and correct CSV row counts.
- Unique lesson IDs and populated code examples.

`node --check web/dist/app.js`: passed.

## Browser verification against local release assets

| Check | Result |
| --- | --- |
| Eight lesson cards load | Pass |
| Machine learning filter | Pass: exactly one matching lesson |
| Search with no matches | Pass: explanatory empty state |
| NumPy lesson modal | Pass: example and execution limitation visible |
| Mark lesson complete and reload | Pass: 1 of 8 retained |
| Download NumPy example | Pass: `numpy.py` observed in Downloads, 229 bytes |
| Slope 2 / noise 0 / 60 samples | Pass: fitted slope 2.000, R² 1.000, RMSE 0.000 |
| Slope -4 / noise 0 | Pass: fitted slope -4.000, R² 1.000, RMSE 0.000 |
| Reset model | Pass: default slope 2.054, R² 0.977, RMSE 0.949 |
| Download CSV | Pass: downloaded `regression-experiment.csv`, 1079 bytes; validated 30 rows, finite numeric x/y values, and x endpoints 0 and 10 |
| Plot gallery | Pass: all three image elements loaded |
| 390 × 844 mobile viewport | Pass: rendered; content width 375 px, viewport 390 px; no horizontal overflow |

Six screenshots in `assets/showcase/` show the local release app, not an authenticated production session. The in-app browser screenshot path was unreliable; Chrome produced the verified captures.

## Production deployment

Sites reported **succeeded** for source commit `97cc75165321425c5965a172e907f3436c47c4f9`.

URL: https://python-r-learning-lab-vams2krish.adam-vamshikrishna.chatgpt.site

Access: owner-private. A browser visit verified the sign-in gate. Following the sign-in link reached the OpenAI login page; an authenticated production app walkthrough was not completed because the browser has no active login. Local tests therefore establish behavior of the same static assets, while the deployment result establishes successful publication. This is not a production load, security, or cross-browser certification.

## Remaining limits

- Python/R snippets are instructional examples; the browser does not run them.
- Original notebooks and local datasets remain outside this repository and have not been executed as a suite.
- Progress lives in browser storage and is not synchronized between devices.
- Modern-browser smoke tests cover Chrome desktop and a mobile viewport, not physical mobile devices or a complete accessibility audit.

## Python example checks

Seven exported Python examples passed syntax compilation. Collections, objects and SQLite examples executed successfully with Python. NumPy/pandas/Matplotlib/scikit-learn snippets and the R snippet were not runtime-tested.
