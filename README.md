# edit-nupkg-manifest  

This action will update the manifest metadata inside an existing NuGet package. The intended use-case is to edit generated packages that aren't created with support for all the necessary metadata to publish that package to a GitHub NuGet feed. For example, the Octopus Deploy CLI does not support `repository` as a valid piece of manifest metadata.   

Current Fields Supported:
- Version
- Repository

## Usage 

Inputs `nupkgPath` and `nuspecName` are mandatory. 

### Basic  

```yaml
steps:
- uses: stesta/edit-nupkg-manifest
  with: 
    nupkgPath: '__tests__/test.nupkg'
    nuspecName: 'test.nuspec'
    version: '1.2.3'
    repositoryUrl: 'https://github.com/username/repositoryname'
```

### Supported Options

| name | type | description |  
| - | - | - |
| version | string | nupkg version number |   
| repositoryUrl | string | the associated GitHub repository url for the package |  