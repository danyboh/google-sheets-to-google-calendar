/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
  extends: 'google',
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    'node': true,
    'googleappsscript/googleappsscript': true
  },
  rules: {
    'require-jsdoc': 'off',
    'jsdoc/require-jsdoc': 'off',
    'jsdoc/require-param': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/check-tag-names': 'off',
    'jsdoc/check-types': 'off',
    'linebreak-style': 'off',
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', {code: 100}],
    'camelcase': ['error', {
      'ignoreDestructuring': true,
      'ignoreImports': true,
      'allow': ['access_type', 'redirect_uris']
    }],
    'guard-for-in': 'off',
    'no-var': 'off', // ES3
    'no-unused-vars': 'off' // functions aren't used.
  },
  plugins: [
    'googleappsscript'
  ]
};
