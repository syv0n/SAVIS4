# SAVIS4 Overview

<p align="center">
    <img alt="savisLogo" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/SavisLogo.png">
</p>

SAVIS4 is a statistical analysis website built at the request of Professor Rafael Diaz who teaches at California State University, Sacramento. SAVIS4 aims to provide an open-source educational platform for students around the world to help them better understand statistics. This platform provides a myriad of visualization tools, allowing users to actively engage with various statistical concepts and enhance their comprehension.

<p>
    <a href="https://savias-c1f4d.web.app/homepage">Website Link</a>
</p>

# Features
### One Proportion Hypothesis Testing
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OPHT.png">
One Proportion Hypothesis Testing feature first loads data and generates a graphical representation looking at one proportion. In this case, one-proportion tests compare a sample proportion to a specific value. It then runs simulations to assess the significance of the observed difference, and finally, it analyzes the Sampling Distribution of Difference of Proportions to determine the likelihood of the observed results occurring by chance alone.

### Two Proportion Hypothesis Testing
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/Two%20Prop.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/Two%20Prop%202.png">
Two Proportion Hypothesis Testing feature first loads data and generates a graphical representation comparing two proportions. In this case, two-proportion tests compare proportions from two different groups or samples. It then runs simulations to assess the significance of the observed difference, and finally, it analyzes the Sampling Distribution of Difference of Proportions to determine the likelihood of the observed results occurring by chance alone.

### One Mean Hypothesis Testing
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OMHT1.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OMHT2.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OMHT3.png">
One Mean Hypothesis Testing determines the size, mean, formula, standard deviation, minimum & maximums, and proportions of the sample based on input from the user either manually or through a .csv file. This feature gives users the graphing of their data, a simulation of the sample poportion, and distribution of the sample means.

### Two Mean Hypothesis Testing
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/TMHT1.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/TMHT2.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/TMHT3.png">
Two Mean Hypothesis testing feature determines the sizes, means, formula, standard deviation, minimum & maximums, and proportions of the sample based on input from the user either manually or through a .csv file. This feature gives users the graphing of their data, a simulation of the sample poportion, and distribution of the sample means.

### Bar Chart
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/BAR1.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/BAR2.png">
The Bar Chart on SAVIS allows users to see their data in a typical bar chart with sidebar tables for reference along with a "Draw Samples" feature that can run simulations on the samples given.

### Dot Plot
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/DOT1.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/DOT2.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/DOT3.png">
The Dot Chart on SAVIS allows users to see their data in a typical scatterplot with sidebar tables for reference along with a "Draw Samples" feature that can run simulations on the samples given.

### Linear Regression Visualization 
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/Linear.png">
Linear regression is a statistical method used to model the relationship between two or more variables by fitting a linear equation to observed data. In our project, we employ linear regression to analyze the linear relationship between a dependent variable and one or more independent variables, enabling us to make predictions and understand the underlying patterns in the data. SAVIS allows the user to move the line (adjust the y-intercept or adjust the slope) to see how it affects the calculation of the squared areas of each point. The point of interest details that are displayed on screen are the regression formula and the sqared area calculation. We supplement this visualization with practice problems that include a step by step solution as well as the answer to the questions.

### Correlation Visualization (WIP)
<img width="1721" alt="savis_correlation" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/correlationS4.png">
The correlation feature allows users to analyze the relationship between two sets of data. It provides both manual and file upload options for inputting data and generates correlation coefficients along with visual cues for analysis. The visual cues includes a movable regression line, this line turns green for strong correlations (r > 0.7) and red for weak ones, with data points colored based on their distance and position relative to the line. Points far above the line appear red, points far below appear blue, and those closest to the line are shown in a darker shade of either color.

### One Proportion Confidence Interval
<img width="1721" alt="savis_regression" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OPCI.png">
This feature helps in estimating a range where the true population proportion lies based on a sample proportion. Here, we take in success and failure and show the proportion of success and the calculation involves the sample size with a chosen level of confidence (eg. 95%). We are able to see mean, standard deviation, lower and upper bounds of the intervals.

### Two Proportions Confidence Interval 
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/TwoProportionsCI.png"> 
A two-proportions confidence interval graph typically displays the difference between two sample proportions along with its confidence interval, often represented as a horizontal line or bar. The graph highlights the point estimate of the difference and the range within which the true difference is expected to lie, based on the specified confidence level.

### One Mean Confidence Interval
<img width="1721" alt="savis_omci" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/OMCISS4.png">
One Mean Confidence Interval calculates the confidence interval for the entered data. The first component allows for the data
to be entered into the data. It also displays the count for each point as a scatter plot. The second part takes a sample and
runs the desired simulation. The third section allows for custom upper and lower bound to be added. The fourth section displays
graphs where it checks if it covers the mean of the actual in the sample collected when the bounds are added into consideration.

### Two Mean Confidence Interval 
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/2MCI.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/2MCI2.png">
Two Means Confidence Interval feature in our Angular application allows users to load, analyze, and visualize data for two distinct groups, calculating and displaying confidence intervals for their mean differences. Users can interactively adjust data, run simulations, and explore statistical results through dynamic charts, enhancing understanding of data distributions and variability.

### User Manual
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/User-Manual-Screenshot.png">
The User Manual page provides users with guidance on how to use the site's statistical tools. It explains each tool's purpose and helps users interpret and apply the results for data analysis. Users can use each graph's respective manual to gain more information on how each testing module works. They can also find links to the respective practice problems or the graph module page.

### Calculator
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/calculatorReadme.png">
The Cacluator feature provides a user-friendly interface for performing basic arithmetic operations directly within the SAVIS4 platform. It is accessible by a toggle button on the top left on every page. It supports addition, substraction, multiplication, division, percentage calculations, and positive/negative toggling. The calculator is designed with a clean, responsive layout that adapts to light/dark mode, making it a convenient tool for students performing quick computations while engaging with statisitcal analysis. 

### Practice Problems
<img width="1721" src="https://github.com/syv0n/SAVIS4/raw/master/savis4/src/assets/practiceProbsSelection.png">
The Practice Problems feature allows for users to practice their knowledge on each testing module to better their understanding on each statistical concept. Users can cycle through problems and see if their answer is correct. Additionaly, some modules contain a workspace for the user to scribble their thinking process directly on the website.

# System Requirements

* NodeJS Version: 16.14.0 or higher
* Cypress: 15.4.0
* NPM: 10.8.2 (other versions should also work)
* Angular CLI Version: 12.2.18
* TypeScript: 4.3.5

# Setup Instructions

### 1. Clone the Repository

Clone the GitHub repository by running the following command:

```bash
git clone https://github.com/syv0n/SAVIS4
```

### 2. Navigate to the Project Directory

Navigate to the savis4 directory by running the following command:

```bash
cd SAVIS4/savis4
```

### 3. Install Dependencies

Install all required packages by running:

```bash
npm install
```

### 4. Running the Application Locally

To start the development server:

```bash
npm start
```

Then navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any source files.

# Testing

SAVIS4 primarily uses Cypress for comprehensive end-to-end testing that simulates real user interactions and validates the entire application flow.

## End-to-End (E2E) Testing with Cypress

### Prerequisites

Before running Cypress tests, ensure the Angular development server is running (see Step 4 in Setup Instructions: `npm start`).

### Running Cypress in Interactive Mode

To run Cypress in interactive mode (Note: Recording not possible in this mode):

```bash
npm run cypress:open
```

Select "E2E Testing", choose your preferred browser, and click Start. Click on any spec file to run the automated tests for that specific feature or component.

### Running Cypress in Headless Mode (SAVIS Preference)

To run Cypress in headless mode and generate videos:

```bash
npm run cypress:run
```

Test artifacts (videos and screenshots) will be automatically saved to the `cypress-artifacts/` directory with timestamped folders in the format `YYYY-MM-DD_HH-MM-SS`.

## Unit Testing

SAVIS4 includes light unit tests using Jest for redundant component-level testing. These are optional and primarily for quick validation during development.

Run `npm run test:coverage` to execute unit tests and view coverage in `savis4/coverage/index.html`.


# Building the Application

To build the project for production deployment, run:

```bash
npm run build:prod
```

The build artifacts will be stored in the `dist/Savis4/` directory.

# Deployment 

The project was originally setup with Github Actions to automatically deploy the project to Github Pages. Normally when deploying the project, one would simply push their changes to the `main` branch and the deployment will be triggered automatically. However, because development is currently underway, the Github Actions is currently disabled for SAVIS4. However, the deployed project from about a year ago is still running from the previous SAVIS3 Github Actions Page.

You can visit the old deployed project at [savis3](https://savias-c1f4d.web.app/login).

If you forked the repository, you can deploy the project by changing the Firebase API keys in `environment` directory and running `firebase init` and `firebase deploy` commands. A more detailed instruction video can be found here: [Firebase Deployment](https://www.youtube.com/watch?v=UNCggEPZQ0c)

# Developer Instructions 

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.18.

### Development server

Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `npm run electron:build` to build the project. The build artifacts will be stored in the `dist/electron` directory.

Currently the downloadable packages are in github releases https://github.com/syv0n/SAVIS4/releases/tag/v1.0.0

- Savis4-Portable-Linux.zip (linux machines)
- Savis4-Portable-Windows.zip (windows machines)

Windows 

1. Unzip the package
2. Launch Savis4.exe

Linux

1. Unzip the package
2. Make binary executable (chmod +x Savis4)
3. Run ./Savis4

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference page](https://angular.io/cli).

# Important Notes

* Node environment requires the `--openssl-legacy-provider` flag for compatibility with older OpenSSL versions. This is automatically included in the npm scripts.
* All test artifacts from Cypress are automatically organized by date and timestamp and should NOT be committed to the repository unless for documentation purposes.
* The project uses Angular CLI Version: 12.2.18 and requires TypeScript v4.3.5 for compatibility.

# Contributors

### SAVIS4 Team
- Shayn Voon (shaynvoon@csus.edu)
- Steven Masters (stevenmasters@csus.edu)
- Kenny Yang (Kyang14@csus.edu)
- Xai Yang (xaiyang2@csus.edu)
- Danny Le (dannyle@csus.edu)
- Alina Corpora (alinacorpora@csus.edu)
- Veronika Tupy (vtupy@csus.edu)
- Jacob Rutter (jarutter@csus.edu)
