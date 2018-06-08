import React from "react";
import MaterialListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const ListItem = ({theme, primary = "", secondary = "", language, url}) => (
  <MaterialListItem button href={url} component="a" target="_blank">
    <ListItemText primary={primary} secondary={secondary} />
  </MaterialListItem>
)

export default ListItem;