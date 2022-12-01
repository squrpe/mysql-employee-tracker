const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./db/connection');
const logo = require('asciiart-logo');
const config = require('./package.json');

const utils = require('util');

db.query = utils.promisify(db.query);

// Main Application Function

const application = () => {
    console.log(logo(config).render());
    
    inquirer.prompt( [
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View all departments',
                    'View all Roles',
                    'View all employees',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Quit']
        }
    ])

    .then((response) => {
        if (response.choice === 'View all departments') {
            viewDepartments();
        }

        else if (response.choice === 'View all Roles') {
            viewRoles();
        }

        else if (response.choice === 'View all employees') {
            viewEmployees();
        }

        else if (response.choice === 'Add a department') {
            addDepartment();
        }

        else if (response.choice === 'Add a role') {
            addRole();
        }

        else if (response.choice === 'Add an employee') {
            addEmployee();
        }

        else if (response.choice === 'Update an employee role') {
            updateRole();
        }

        else if (response.choice === 'quit') {
            process.exit();
        }
    })
}

// View Department Function

const viewDepartments = () => {
    db.query('SELECT * FROM department').then((results, err) => {
        if (err) console.log(err)
        console.table(results)
        application();
    })
}

// View Roles Function

const viewRoles = () => {
    db.query('SELECT * FROM role').then((results, err) => {
        if (err) console.log(err)
        console.table(results)
        application();
    })
}

// View Employees Function

const viewEmployees = () => {
    db.query('SELECT * FROM employee').then((results, err) => {
        if (err) console.log(err)
        console.table(results)
        application();
    })
}

// Add Department Function

const addDepartment = () => {
    inquirer.prompt([
        {
            type:'input',
            name:'newDepartment',
            message: 'What is the name of the new department?'
        }
    ]).then((response) => {
        const { newDepartment } = response;
        db.query('INSERT INTO department (department_name) VALUES (?)', [newDepartment])
    }).then((results, err) => {
        if (err) console.log(err)
        console.log('New Department added to database!')
        application();
    })
}

// Add Role Function

const addRole = () => {
    db.query('SELECT * FROM department').then((results, err) => {
        if (err) console.log(err);
        let departmentChoices = results.map(({ id,  department_name }) => ({
            value: id,
            name:  department_name
        }))

        inquirer.prompt([
            {
                type:'input',
                name:'newRole',
                message: 'What is the name of the new role?'
            },
            {
                type:'input',
                name:'newSalary',
                message: 'What is the salary of this new role?'
            },
            {
                type:'list',
                name:'departmentName',
                message: 'What department does this new role belong to?',
                choices: departmentChoices
            }
        ]).then((response) => {
            const { newRole, newSalary, departmentName } = response;
            db.query('INSERT INTO role (title, salary, department_id) VALUES(?, ?, ?)', [
                newRole, newSalary, departmentName
            ]).then((results, err) => {
                if (err) console.log(err)
                console.log('New Role added to database!')
                application();
            })
        })

    })
    
}

// Add Employee Function

const addEmployee = () => {
    db.query('SELECT * FROM role').then((results, err) => {
        if (err) console.log(err);
        let roleChoices = results.map(({ id, title }) => ({
            value: id,
            name: title
        }))

        db.query('SELECT * FROM employee').then((results, err) => {
            if (err) console.log(err);
            let managerChoice = results.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }))

            inquirer.prompt ([
                {
                    type:'input',
                    name:'firstName',
                    message: 'What is the employees first name?'
                },
                {
                    type:'input',
                    name:'lastName',
                    message: 'What is the employees last name?',
                },
                {
                    type:'list',
                    name:'role',
                    message: 'What is the employees role?',
                    choices: roleChoices
                },
                {
                    type:'list',
                    name:'managerName',
                    message: 'Who is the employees manager?',
                    choices: managerChoice
                }
            ]).then((response) => {
                const { firstName, lastName, role, managerName } = response;
                db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
                    firstName, lastName, role, managerName
                ]).then((results, err) => {
                    if (err) console.log(err)
                    console.log('Employee added to database!')
                    application();
                })
            })
        })
    })
}

// Update Employee Role Function

const updateRole = () => {
    db.query('SELECT * FROM role').then((results, err) => {
        if (err) console.log(err);
        let roleChoices = results.map(({ id, title }) => ({
            value: id,
            name: title
        }))
        db.query('SELECT * FROM employee').then((results, err) => {
            if (err) console.log(err);
            let employeeChoices = results.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }))

            inquirer.prompt([
                {
                    type:'list',
                    name:'employeeName',
                    message: 'Which employee do you want to access?',
                    choices: employeeChoices
                },
                {
                    type:'list',
                    name:'newRole',
                    message: 'Please select the employes new role:',
                    choices: roleChoices
                }
            ]).then((response) => {
                const { employeeName, newRole } = response;
                db.query(`UPDATE employee SET role_id = ${newRole} WHERE id = ${employeeName}`)
                .then((results, err) => {
                    if (err) console.log(err)
                    console.log('Employee updated in database!')
                    application();
                })
            })
        })

    })
}

application();