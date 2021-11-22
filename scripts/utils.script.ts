import { resolve, join, relative } from 'path';
import fs from 'fs-extra';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { uniqArray, isTruthy } from '@praburangki/web-utilities';
import { packages } from '../meta/packages.meta';
import { PackageIndexes, VueUsePackage, VueUseFunction } from '../meta/types.meta';

const DOCS_URL = 'https://composables.praburangki.dev';
// const GITHUB_BLOB_URL = 'https://github.com/praburangki/composables/blob/main/packages';

const DIR_SRC = resolve(__dirname, '../packages');
const DIR_ROOT = resolve(__dirname, '..');

export async function listFunctions(dir: string, ignore: string[] = []) {
  const files = await fg('*', {
    onlyDirectories: true,
    cwd: dir,
    ignore: ['_*', 'dist', 'node_modules', ...ignore],
  });

  files.sort();

  return files;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export async function readIndexes() {
  const indexes: PackageIndexes = {
    packages: {},
    categories: [],
    functions: [],
  };

  for (const info of packages) {
    const dir = join(DIR_SRC, info.name);

    const functions = await listFunctions(dir);

    const pkg: VueUsePackage = {
      ...info,
      dir: relative(DIR_ROOT, dir).replace(/\\/g, '/'),
      docs: info.addon ? `${DOCS_URL}/${info.name}/README.html` : undefined,
    };

    indexes.packages[info.name] = pkg;

    for (const fnName of functions) {
      const mdPath = join(dir, fnName, 'index.md');

      const fn: VueUseFunction = {
        name: fnName,
        package: pkg.name,
      };

      if (fs.existsSync(join(dir, fnName, 'component.ts'))) {
        fn.component = true;
      }

      if (fs.existsSync(join(dir, fnName, 'directive.ts'))) {
        fn.directive = true;
      }

      if (!fs.existsSync(mdPath)) {
        fn.internal = true;
        indexes.functions.push(fn);
        continue;
      }

      fn.docs = `${DOCS_URL}/${pkg.name}/${fnName}/`;

      const mdRaw = await fs.readFile(join(dir, fnName, 'index.md'), 'utf-8');

      const { content: md, data: frontmatter } = matter(mdRaw);
      const category = frontmatter.category;

      let description =
        (md.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';

      description = description.trim();
      description = description.charAt(0).toLowerCase() + description.slice(1);

      fn.category = ['core', 'shared'].includes(pkg.name) ? category : `@${pkg.display}`;
      fn.description = description;

      if (description.includes('DEPRECATED')) {
        fn.deprecated = true;
      }

      indexes.functions.push(fn);
    }
  }

  indexes.categories = getCategories(indexes.functions);

  return indexes;
}

export function getCategories(functions: VueUseFunction[]): string[] {
  return uniqArray(
    functions
      .filter((i) => !i.internal)
      .map((i) => i.category)
      .filter(isTruthy)
  ).sort();
}
