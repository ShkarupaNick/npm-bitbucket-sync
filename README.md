# Automated Pull Request Script

This document outlines the implementation details for a Node.js script that updates the `package.json` file in a BitBucket repository and opens a pull request. The script will be run manually initially and can be integrated into the existing system later.

## Requirements

The following requirements have been identified for the script:

1. The script should be implemented in Node.js.
2. It should accept the name of the package and its version as inputs.
3. The repository details to be updated should be provided as input.
4. Authentication should be handled using an authentication token.
5. The script should update the `package.json` file in the specified repository.
6. It should open a pull request with the updated `package.json` file.

## Implementation

The following steps outline the implementation details for the script:

1. Read the environment variables using the `nconf` library. The required environment variables are as follows:
    - `AUTH_TOKEN`: An authentication token used for authentication with BitBucket. This token can be obtained from the BitBucket account settings or provided as a hardcoded value.
    - `PACKAGE_WORKSPACE`: The BitBucket workspace where the repository is located.
    - `PACKAGE_NAME`: The name of the package to be updated.
    - `PACKAGE_VERSION`: The new version of the package.
2. Authenticate with BitBucket using the provided authentication token. This can be done by including the token in the API request headers.
3. Retrieve the `latest commit hash` based on the provided workspace and package name.
4. Read the existing `package.json` file from the repository.
5. Update the `version` field in the `package.json` file with the provided package version.
6. Commit the updated `package.json` file to the new branch in the repository.
7. Open a pull request for created branch in the repository with the updated `package.json` file.
8. Print the URL of the opened pull request to the console or return it as the output of the script.

## Script Usage

To run the script, follow these steps:

1. Ensure Node.js is installed on your system.
2. Install the required dependencies by running `npm install` in the script's directory.
3. Set the required environment variables. In this case, the `AUTH_TOKEN`, `PACKAGE_WORKSPACE`, `PACKAGE_NAME`, and `PACKAGE_VERSION` variables should be set.
4. Make sure that you specified needed env vars. Run the script using the command `npm run build && npm start`.

## Conclusion

This document has provided an overview of the implementation details for a Node.js script that updates the `package.json` file in a BitBucket repository and opens a pull request. The script can be run manually and integrated into the existing system later. By following the outlined steps, you should be able to successfully execute the script and automate the pull request process for releasing new versions of npm libraries.
