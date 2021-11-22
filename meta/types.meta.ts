import '@praburangki/web-utilities';

export interface PackageManifest {
  name: string;
  display: string;
  addon?: boolean;
  author?: string;
  description?: string;
  external?: string[];
  globals?: Dictionary<string>;
  manualImport?: boolean;
  deprecated?: boolean;
  submodules?: boolean;
  iife?: boolean;
}

export interface VueUseFunction {
  name: string;
  package: string;
  category?: string;
  description?: string;
  docs?: string;
  deprecated?: boolean;
  internal?: boolean;
  component?: boolean;
  directive?: boolean;
}

export interface VueUsePackage extends PackageManifest {
  dir: string;
  docs?: string;
}

export interface PackageIndexes {
  packages: Dictionary<VueUsePackage>;
  categories: string[];
  functions: VueUseFunction[];
}
