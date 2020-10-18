import React from 'react';
import { TableRow } from "./TableRow";

export function Table ({posts}) {

  return (
    <div className="container col-xl-8">
        {posts?posts.map(contentId => <TableRow contentId={contentId} key={contentId} />):<></>}
    </div>
  );
}
