# edit-nupkg-manifest  

This action will update the manifest metadata inside an existing NuGet package. The intended use-case is to edit generated packages that aren't created with support for all the necessary metadata to publish that package to a GitHub NuGet feed. For example, the Octopus Deploy CLI does not support `repository` as a valid piece of manifest metadata.   

## V1 -> V2 Notes

Please note that, with the release of version 2, the need to specify the package's `nuspecName` is no longer necessary. This action will now introspect the zip file list to find the nuspec filename automatically. 

Version 2 also includes the ability to specify a `nuspecPath`. The `nuspecPath` field (not to be confused with the previous `nuspecName`) can be used to specify a nuspec file on disk whose xml contents will be used as the base xml for the package manifest. Think of this like copying a nuspec on disk to the package directly. This happens **before** any other metadata changes.

## Usage 

`nupkgPath` is the only mandatory field. Without any of the optional fields, however, the package manifest will remain unmodified.

### Example 1   

```yaml
# simple metadata edits of 'version' and 'repository'
steps:
- uses: stesta/edit-nupkg-manifest@v2
  with: 
    nupkgPath: '__tests__/test.0.1.0.nupkg'
    version: '1.2.3'
    repositoryUrl: 'https://github.com/username/repositoryname'
```
### Example 2  

```yaml
# before metadata edits are applied, this example demonstrates how 
# the contents from '__tests__/test.nuspec' can be used as the base xml 
steps:
- uses: stesta/edit-nupkg-manifest@v2
  with: 
    nupkgPath: '__tests__/test.0.1.0.nupkg'
    nuspecPath: '__tests__/test.nuspec'
    version: '1.2.3'
    authors: 'stesta'
    repositoryUrl: 'https://github.com/username/repositoryname'
```

### Supported Options

| name | type | description |  
| - | - | - |
| nuspecPath | string | path to a .nuspec file that will be used as the base xml for the package manifest |  
| id | string | case-insensitive package identifier |
| title | string | human-friendly title of the package |
| description | string | a description of the package |
| version | string | version of the package |   
| authors | string | comma-separated list of package authors |
| owners | string | comma-separated list of package creators |
| repositoryUrl | string | the associated GitHub repository url for the package | 


 