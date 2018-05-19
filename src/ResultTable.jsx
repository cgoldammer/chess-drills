import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';

import styles from './ResultTable.css';

export class ResultTable extends React.Component {
  constructor(props){
    super(props);
  }
  onRowSelect = (e, row) => {
    this.props.rowSelector(row);
  }
  render = () => {
    const rowEvents = { onClick: this.onRowSelect };
    const columns = [ {dataField: 'id', text: 'Id'}
    , {dataField: 'reference', text: 'Name'}
    , {dataField: 'type', text: 'Material'}
    , {dataField: 'right', text: 'Number right', sort: true}
    , {dataField: 'wrong', text: 'Number wrong', sort: true}
    ];
    const sort = [{dataField: "wrong", order:"desc"}];
  
    return (
      <div>
        <div className={styles.resultTable}>
          <BootstrapTable defaultSorted={sort} keyField="id" data={this.props.data} columns={columns} rowEvents={rowEvents}/>
        </div>
      </div>
    )
  }
}
