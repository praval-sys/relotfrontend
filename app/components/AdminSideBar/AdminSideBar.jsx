'use client';

import { useState } from 'react';
import {
  MdOutlineSpaceDashboard,
} from 'react-icons/md';
import { LiaUserSolid } from 'react-icons/lia';
import { LuMessageSquareText, LuFiles } from 'react-icons/lu';
import { CiBookmark } from 'react-icons/ci';
import { IoStatsChartOutline } from 'react-icons/io5';
import { PiSignOutFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';
import { setsideNav } from '../../redux/reducer/sideNavSlice';
import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', icon: <MdOutlineSpaceDashboard />, path: '/admin/dashboard', key: 'dashboard' },
  { name: 'Create Product', icon: <LiaUserSolid />, path: '/admin/createProduct', key: 'users' },
  { name: 'Messages', icon: <LuMessageSquareText />, path: '/admin/editProduct', key: 'messages' },
  { name: 'Bookmark', icon: <CiBookmark />, path: '#', key: 'bookmark' },
  { name: 'Files', icon: <LuFiles />, path: '#', key: 'files' },
  { name: 'Stats', icon: <IoStatsChartOutline />, path: '#', key: 'stats' },
];

export default function AdminSideBar() {
  const [activeLink, setActiveLink] = useState('dashboard');
  const isNavExpanded = useSelector((state) => state.sideNav.navOpen);
  const dispatch = useDispatch();

  const toggleNav = () => {
    dispatch(setsideNav(!isNavExpanded));
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col justify-between py-4 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between px-4">
        <button
          onClick={toggleNav}
          className="text-xl text-white bg-gray-700 p-2 rounded hover:bg-gray-600"
        >
          {isNavExpanded ? '✖' : '☰'}
        </button>
        <img
          src="https://i.imgur.com/hczKIze.jpg"
          alt="User"
          className={`rounded-full transition-all duration-300 ${
            isNavExpanded ? 'w-10 h-10' : 'w-6 h-6'
          }`}
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 space-y-2 px-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.path}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors ${
              activeLink === item.key ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveLink(item.key)}
          >
            {item.icon}
            {isNavExpanded && <span className="whitespace-nowrap">{item.name}</span>}
          </Link>
        ))}
      </nav>

      {/* Signout */}
      <div className="px-2">
        <Link
          href="#"
          onClick={() => setActiveLink('signout')}
          className="flex items-center gap-3 p-2 rounded-md hover:bg-red-600 transition-colors"
        >
          <PiSignOutFill />
          {isNavExpanded && <span className="whitespace-nowrap">Sign Out</span>}
        </Link>
      </div>
    </div>
  );
}
