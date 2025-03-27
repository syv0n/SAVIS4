# SAVIS4 Overview
<p align="center">
    <img alt="savisLogo" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/SavisLogo.png">
</p>
SAVIS4 is a website built at the request of Prof. Rafael Diaz who teaches at California State University, Sacramento. SAVIS4 aims to provide an open-source educational platform for students around the world to help them better understand statistics. This platform provides a myriad of visualization tools, allowing users to actively engage with various statistical concepts and enhance their comprehension. 

### One Proportion Confidence Interval
<img width="1721" alt="savis_regression" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/OPCI.png">
This feature helps in estimating a range where the true population proportion lies based on a sample proportion. Here, we take in success and failure and show the proportion of success and the calculation involves the sample size with a chosen level of confidence (eg. 95%). We are able to see mean, standard deviation, lower and upper bounds of the intervals.

### One Mean Confidence Interval
<img width="1721" alt="savis_omci" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/OMCISS4.png">
One Mean Confidence Interval calculates the confidence interval for the entered data. The first component allows for the data
to be entered into the data. It also displays the count for each point as a scatter plot. The second part takes a sample and
runs the desired simulation. The third section allows for custom upper and lower bound to be added. The fourth section displays
graphs where it checks if it covers the mean of the actual in the sample collected when the bounds are added into consideration.

### Correlation Feature
<img width="1721" alt="savis_correlation" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/correlation.png">
The correlation feature allows users to analyze the relationship between two sets of data. It provides both manual and file upload options for inputting data and generates correlation coefficients along with visual charts for analysis.

### Two Proportion Hypothesis Testing
<img width="1721" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/Two Prop.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/Two Prop 2.png">
Two Proportion Hypothesis Testing feature first loads data and generates a graphical representation comparing two proportions. It then runs simulations to assess the significance of the observed difference, and finally, it analyzes the Sampling Distribution of Difference of Proportions to determine the likelihood of the observed results occurring by chance alone.

### Linear Regression Visualization
<img width="1721" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/Linear.png">
Linear regression is a statistical method used to model the relationship between two or more variables by fitting a linear equation to observed data. In our project, we employ linear regression to analyze the linear relationship between a dependent variable and one or more independent variables, enabling us to make predictions and understand the underlying patterns in the data.

### Two Mean Confidence Interval 
<img width="1721" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/2MCI.png">
<img width="1721" src="https://github.com/syv0n/SAVIS4/blob/master/savis4/Savis4/src/assets/2MCI2.png">
Two Means Confidence Interval feature in our Angular application allows users to load, analyze, and visualize data for two distinct groups, calculating and displaying confidence intervals for their mean differences. Users can interactively adjust data, run simulations, and explore statistical results through dynamic charts, enhancing understanding of data distributions and variability.

### Two Proportions Confidence Interval 
<img width="1721" src="savis4/src/assets/TwoProportionsCI.png">
A two-proportions confidence interval graph typically displays the difference between two sample proportions along with its confidence interval, often represented as a horizontal line or bar. The graph highlights the point estimate of the difference and the range within which the true difference is expected to lie, based on the specified confidence level.


# Pre-requisites
* NodeJS a
* NPM
* Angular CLI

# Installation
1. Clone to repository to your local machine.
2. `Cd` into the `savis4` directory.
3. Run `npm install` to install all the dependencies.

# Testing 
## Unit Testing 

### Running unit tests
Run `ng test` to execute the unit tests via [Jest] https://github.com/jestjs/jest.

### Running all test 
Run `npm run test:coverage` to execute a test for all the features with a unit test. Once all the test has ran the results will show up in the terminal as well as in the file savis4 -> coverage -> index.html.

## Functional Testing

### Running end-to-end functional test
Before running tests, the Angular project needs to be deployed into a local server using `ng serve`. This command compiles the application and starts a development server

Run `npm run cypress:open` to execute the automated tests via [Cypress] https://github.com/cypress-io/cypress

Once Cypress is open select "E2E testing" then select the preferred browser then Start. 

Every feature/component has its own spec, clicking on them will start the automated tests for that specific feature or component.


# Deployment 
The project is setup with Github Actions to automatically deploy the project to Github Pages. To deploy the project, simply push your changes to the `main` branch and the deployment will be triggered automatically.

You can visit the deployed project at [savis4](https://savias-c1f4d.web.app/login).

If you forked the repository, you can deploy the project by changing the Firebase API keys in `environment` directory and running `firebase init` and `firebase deploy` commands. A more detailed instruction video can be found here: [Firebase Deployment](https://www.youtube.com/watch?v=UNCggEPZQ0c)

# Developer Instructions 
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.18.

### Development server
Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding
Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build
Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

To package the project for Linux, Windows, and Mac, run `npm run electron:package`. This will create `savis4-darwin-x64`, `savis4-linux-x64`, and `savis4-win32-x64` directories in the `savis4` directory. Zip the contents of the directory and distribute the zip file.

### Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference page](https://angular.io/cli).

## SAVIS3 Team
- Bikram Singh (bikramsingh@csus.edu)
- Jason Yu (jasonyu@csus.edu)
- Albin Shabu (albinshabu@csus.edu)
- Emad Sabir (sunnysabir@csus.edu)
- Vaibhav Jain (vaibhavjain@csus.edu)
- Hetvi Patel (hetviapatel@csus.edu)
- Sri Charan (skondragunta@csus.edu)
- Hormoz Halimi (hormozhalimi@csus.edu)
- Sarthak Bhalla (sarthakbhalla@csus.edu)

## SAVIS4 Team
- Shayn Voon (shaynvoon@csus.edu)
- Steven Masters (stevenmasters@csus.edu)
- Kenny Yang (Kyang14@csus.edu)
- Xai Yang (xaiyang2@csus.edu)
- Danny Le (dannyle@csus.edu)
- Alina Corpora (alinacorpora@csus.edu)
- Veronika Tupy (vtupy@csus.edu)
- Jacob Rutter (jarutter@csus.edu)
