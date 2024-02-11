import React from 'react';
import { TbDatabaseStar, TbDatabasePlus  } from "react-icons/tb";


export const links = [
  {
    title: 'Dashboard',
    links: [
      {
        name: 'Data Utama',
        url: '',
        icon: <TbDatabaseStar />,
      },
    ],
  },

  {
    title: 'Dataset',
    links: [
      {
        name: 'Ubah Dataset',
        url: 'datasetedit',
        icon: <TbDatabasePlus />,
      },
    ],
  },
];