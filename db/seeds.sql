INSERT INTO department (department_name)
VALUES ("Administration"),
       ("Human Resources"),
       ("Research and Development"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Administration Manager", 100000, 1),
       ("Administration Agent", 50000, 1),
       ("HR Manager", 75000, 2),
       ("HR Recruiter", 70000, 2),
       ("Employee Relations Advisor", 42000, 2),
       ("RD Manager", 85000, 3),
       ("RD Cultural Advisor", 75000, 3),
       ("RD Representative", 40000, 3),
       ("Financial Manager", 100000, 4),
       ("Finicial Administrator", 84000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Isabella", "Brown", 1, NULL),
       ("Gina", "Wilson", 2, 1),
       ("Danny", "Garcia", 3, NULL),
       ("Keanu", "Smith", 4, 3),
       ("Francis", "Thomson", 5, 3),
       ("Jorge", "Rodriguez", 6, NULL),
       ("Billy", "Nguyen", 7, 6),
       ("Marie", "Wood", 8, 6),
       ("Zara", "Nicole", 9, NULL),
       ("Tommy", "Fulton", 10, 9);