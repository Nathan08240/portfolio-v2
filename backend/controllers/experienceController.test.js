process.env.DB_PATH = ':memory:';
const test = require('node:test');
const assert = require('node:assert');
const { sortExperiences } = require('./experienceController');

test('expériences triées par date réelle, en cours en tête', () => {
  const exps = [
    { id: 1, startDate: '2015', endDate: '2017' },
    { id: 2, startDate: '2020', endDate: '2022' },
    { id: 3, startDate: '2022', endDate: 'Présent' },
    { id: 4, startDate: 'Sept 2023', endDate: 'Juin 2024' },
    { id: 5, startDate: '2019', endDate: null },
    { id: 6, startDate: '01/2024', endDate: '03/2024' },
  ];
  assert.deepStrictEqual(sortExperiences(exps).map((e) => e.id), [3, 5, 4, 6, 2, 1]);
});
