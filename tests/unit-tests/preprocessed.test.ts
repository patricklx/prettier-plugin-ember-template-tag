import { getTemplateLocals } from '@glimmer/syntax';
import { preprocessEmbeddedTemplates } from 'ember-template-imports/lib/preprocess-embedded-templates.js';
import {
  TEMPLATE_TAG_NAME,
  TEMPLATE_TAG_PLACEHOLDER,
} from 'ember-template-imports/lib/util.js';
import { describe, expect, test } from 'vitest';

import { AMBIGUOUS_PLACEHOLDER } from '../helpers/ambiguous.js';
import type { TestCase } from '../helpers/cases.js';
import { getAllCases } from '../helpers/cases.js';
import { format } from '../helpers/format.js';
import type { Config } from '../helpers/make-suite.js';
import { makeSuite } from '../helpers/make-suite.js';

describe('format', () => {
  makeSuite(getAllCases, preprocessedTest)({ name: 'with preprocessed code' });
});

function preprocessedTest(config: Config, testCase: TestCase): void {
  test(`it formats ${testCase.name}`, async () => {
    const code = testCase.code.replaceAll(AMBIGUOUS_PLACEHOLDER, '');
    const preprocessed = preprocessEmbeddedTemplates(code, {
      getTemplateLocals,

      templateTag: TEMPLATE_TAG_NAME,
      templateTagReplacement: TEMPLATE_TAG_PLACEHOLDER,

      includeSourceMaps: false,
      includeTemplateTokens: false,

      relativePath: testCase.path,
    }).output;
    const result = await format(preprocessed, config.options);
    expect(result).toMatchSnapshot();
  });
}
