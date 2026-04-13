import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '../layout/AuthenticatedLayout';
import { changeEmail, changeName, changePassword, getUserProfile } from '../services/api';
import Avatar from '../components/Avatar';
import DefaultAvatar from "../assets/avatars/avatar.jpg"
import ChangeUsernameModal from '../components/ChangeUsernameModal';
import ChangeEmailModal from '../components/ChangeEmailModal';
import ChangeAvatarModal from '../components/ChangeAvatarModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import "../index.css"

const ProfilePage = () => {

    const [ user, setUser ] = useState({})
    const [ activeChangeAvatar, setActiveChangeAvatar ] = useState(false)
    const [ activeChangeUsername, setActiveChangeUsername ] = useState(false)
    const [ activeChangeEmail, setActiveChangeEmail ] = useState(false)
    const [ activeChangePassword, setActiveChangePassword ] = useState(false)

    const getProfile = async () => {
        try {
            const data = await getUserProfile()
            setUser(data)
            console.log(data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getProfile()
    }, [])
    const handleChangePassword = async (password,newPassword) =>{
        try {
            const response = await changePassword(password,newPassword);
            setActiveChangePassword(false);
            await getProfile();
            console.log(response);
        } catch (error) {
            console.log(error.response.data)
        }
    }
    const handleChangeEmail = async (password,newEmail) =>{
        try {
            const response = await changeEmail(password,newEmail);
            setActiveChangeEmail(false)
            await getProfile();
            console.log(response)
        } catch (error) {
            console.log("error:",error)
        }
    }
    const handleChangeUsername = async (password,newUsername) =>{
        try {
            const response = await changeName(password,newUsername);
            setActiveChangeUsername(false)
            await getProfile();
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <AuthenticatedLayout>
            <div className="max-w-4xl mx-auto p-6 space-y-6 bg-background-primary text-white">
                <section className="border-b-2 border-border pb-4">
                    <h1 className="text-2xl font-bold text-brand-yellow">User Profile</h1>
                </section>

                <section className="flex items-center space-x-6 border-2 border-card-border p-4 rounded-md">
                    <div>
                        <Avatar 
                            size={92} 
                            src={user.secure_url || DefaultAvatar}
                        />
                        <button
                            className="mt-2 text-sm text-brand-yellow hover:text-brand-yellow-hover 
                                    hover:underline font-medium transition-all"
                            onClick={() => setActiveChangeAvatar(true)}
                        >
                            Change Avatar
                        </button>
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{user.name}</p>
                        {/* <p className="text-sm text-gray-400">@johndoe</p> */}
                        <p className="text-sm text-gray-400">{user.email}</p>
                        {/* <p className="text-sm text-gray-400">Role: Member</p> */}
                        <p className="text-sm text-gray-400">Joined: Jan 15, 2024</p>
                    </div>
                </section>

                <section className="border-2 border-card-border p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2 text-gray-200">Account Settings</h2>
                    <div className="space-y-2">
                        <button className="btn-link"
                            onClick={() => setActiveChangeUsername(true)}
                        >
                            Change Userame
                        </button>
                        <br/>

                        <button className="btn-link"
                            onClick={() => setActiveChangePassword(true)}
                        >
                            Change Password
                        </button>
                        <br/>

                        <button 
                            className="btn-link"
                            onClick={() => setActiveChangeEmail(true)}
                        >
                            Change Email
                        </button>
                        <br/>

                        <button 
                            className="btn-link"
                        >
                            Manage Two-Factor Authentication
                        </button>
                        <br/>

                        <div className="mt-2">
                            <label className="block font-medium">Notification Preferences</label>
                            <div className="space-y-1 mt-1 text-sm text-gray-300">
                                <label><input type="checkbox" className="mr-2" /> Card assigned to me</label><br />
                                <label><input type="checkbox" className="mr-2" /> Comment on my card</label><br />
                                <label><input type="checkbox" className="mr-2" /> Daily summary email</label>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border-2 border-card-border p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2 text-brand-yellow">Personalization</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block">Theme</label>
                            <select className="mt-1 w-full bg-background-primary border-2 border-card-border rounded p-2 text-white">
                                <option>Light</option>
                                <option>Dark</option>
                            </select>
                        </div>
                        <div>
                            <label className="block">Board Background</label>
                            <input type="color" className="mt-1 w-full h-10 border-2 border-card-border rounded p-1" />
                        </div>
                        <div>
                            <label className="block">Language</label>
                            <select className="mt-1 w-full bg-background-primary border-2 border-card-border rounded p-2 text-white">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div>
                            <label className="block">Time Format</label>
                            <select className="mt-1 w-full bg-background-primary border-2 border-card-border rounded p-2 text-white">
                                <option>12-hour</option>
                                <option>24-hour</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="border-2 border-card-border p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2 text-brand-yellow">Activity Summary</h2>
                    <ul className="list-disc pl-5 text-gray-300 space-y-1">
                        <li>Boards Created: 8</li>
                        <li>Cards Assigned: 25</li>
                        <li>Cards Completed: 20</li>
                        <li>Last Active: 2 hours ago</li>
                    </ul>
                </section>

                {/* <section className="border-2 border-card-border p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2 text-brand-yellow">Connected Services</h2>
                    <ul className="space-y-2 text-gray-300">
                        <li>
                            Google Account: <span className="text-green-400">Connected</span>
                            <button className="ml-2 text-sm text-brand-yellow hover:text-brand-yellow-hover">Disconnect</button>
                        </li>
                        <li>
                            Slack: <span className="text-red-400">Not Connected</span>
                            <button className="ml-2 text-sm text-brand-yellow hover:text-brand-yellow-hover">Connect</button>
                        </li>
                        <li>
                            GitHub: <span className="text-green-400">Connected</span>
                            <button className="ml-2 text-sm text-brand-yellow hover:text-brand-yellow-hover">Disconnect</button>
                        </li>
                    </ul>
                </section>

                <section className="border-2 border-card-border p-4 rounded-md">
                    <h2 className="text-xl font-semibold mb-2 text-brand-yellow">Security</h2>
                    <p className="text-sm text-gray-300 mb-1">Active Sessions:</p>
                    <ul className="text-sm list-disc pl-5 text-gray-400 space-y-1">
                        <li>Chrome - Windows 10 - Today 12:03 PM</li>
                        <li>Safari - iPhone - Yesterday 9:45 PM</li>
                    </ul>
                    <button className="mt-2 text-sm text-red-400 hover:text-red-300">Log out of all sessions</button>
                </section> */}
            </div>
            <ChangeUsernameModal
                active={activeChangeUsername}
                onClose={() => setActiveChangeUsername(false)}
                onSubmitChange={(password,newUsername)=>handleChangeUsername(password,newUsername)}
            />

            <ChangeEmailModal 
                active={activeChangeEmail}
                onClose={() => setActiveChangeEmail(false)}
                onSubmitChange={(password,newEmail)=>handleChangeEmail(password,newEmail)}
            />

            <ChangeAvatarModal
                active={activeChangeAvatar}
                onClose={() => setActiveChangeAvatar(false)}
            />

            <ChangePasswordModal
                active={activeChangePassword}
                onClose={() => setActiveChangePassword(false)}
                onSubmitChange={(password,newPassword)=>handleChangePassword(password,newPassword)}
            />

        </AuthenticatedLayout>
    );
};

export default ProfilePage;
