// SPDX-License-Identifier: MIT

import "./LearnifyCourse.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

pragma solidity ^0.8.15;

contract CourseFactory is Ownable, ReentrancyGuard {
    //Init the array of deployed contract addresses
    address[] public deployedCourses;
    mapping(address => address[]) public studentsCourses;

    function createCourse(
        string memory name,
        string memory description,
        string memory imageHash,
        uint256 price,
        string[] memory moduleNames,
        string[] memory moduleDescriptions,
        string[] memory materialHashes,
        string[] memory questionHashes
    ) public nonReentrant {
        //creates a new course, deploys a new course contract and pushes its address onto the address array
        CourseContract newCourse = new CourseContract(
            msg.sender,
            name,
            description,
            imageHash,
            price,
            moduleNames,
            moduleDescriptions,
            materialHashes,
            questionHashes
        );
        deployedCourses.push(address(newCourse));
    }

    function joinCourse(address courseAddress) public payable {
        CourseContract course = CourseContract(payable(courseAddress));
        studentsCourses[msg.sender].push(courseAddress);
        course.enroll{value: msg.value}(msg.sender);
    }

    function returnEnrolledCourses() public view returns (address[] memory) {
        address[] memory courses = studentsCourses[msg.sender];
        return (courses);
    }

    function getDeployedCourses() public view returns (address[] memory) {
        //returns the full array on deployed contracts
        return deployedCourses;
    }

    function deleteCourse(address _courseAddress) external {
        uint256 index = 0;
        for (uint256 i = 0; i < deployedCourses.length; i++) {
            if (deployedCourses[i] == _courseAddress) {
                index = i;
                break;
            }
        }
        for (uint256 i = index; i < deployedCourses.length - 1; i++) {
            deployedCourses[i] = deployedCourses[i + 1];
        }
        deployedCourses.pop();
    }
}
