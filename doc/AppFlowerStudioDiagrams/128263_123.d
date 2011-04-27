format 76

classinstance 128007 class_ref 128135 // widgets.treePanel
  name ""   xyz 266 4 2000 life_line_z 2000
classinstance 128391 class_ref 128391 // user
  name ""   xyz 40 4 2000 life_line_z 2000
classinstance 128903 class_ref 128519 // browser
  name ""   xyz 109 4 2000 life_line_z 2000
classinstance 132359 class_ref 128263 // WidgetDefinition
  name ""   xyz 544 4 2000 life_line_z 2000
classinstance 133255 class_ref 128647 // server
  name ""   xyz 664 4 2000 life_line_z 2000
classinstance 135047 class_ref 128775 // ObjectRootNode
  name ""   xyz 726 4 2000 life_line_z 2000
classinstance 137223 class_ref 128903 // WidgetDesigner
  name ""   xyz 427 5 2000 life_line_z 2000
durationcanvas 128135 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 206 2010 11 25
end
durationcanvas 129031 classinstance_ref 128391 // :user
  xyzwh 50 76 2010 11 83
end
durationcanvas 129159 classinstance_ref 128903 // :browser
  xyzwh 133 76 2010 11 35
end
durationcanvas 129415 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 92 2010 11 25
end
durationcanvas 130183 classinstance_ref 128903 // :browser
  xyzwh 133 130 2010 11 38
end
durationcanvas 131591 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 155 2010 11 28
end
durationcanvas 132103 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 258 2010 11 69
end
durationcanvas 132487 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 279 2010 11 25
end
durationcanvas 132999 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 312 2010 11 32
end
durationcanvas 133767 classinstance_ref 133255 // :server
  xyzwh 683 333 2010 11 44
end
durationcanvas 134535 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 365 2010 11 25
end
durationcanvas 134791 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 421 2010 11 25
end
durationcanvas 135175 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 471 2010 11 40
end
durationcanvas 135431 classinstance_ref 135047 // :ObjectRootNode
  xyzwh 773 494 2010 11 25
end
durationcanvas 135943 classinstance_ref 135047 // :ObjectRootNode
  xyzwh 773 549 2010 11 25
end
durationcanvas 136199 classinstance_ref 132359 // :WidgetDefinition
  xyzwh 591 593 2010 11 37
end
durationcanvas 136455 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 619 2010 11 50
end
durationcanvas 137351 classinstance_ref 137223 // :WidgetDesigner
  xyzwh 473 651 2010 11 25
end
durationcanvas 137607 classinstance_ref 128007 // :widgets.treePanel
  xyzwh 317 702 2010 11 40
end
durationcanvas 137735 classinstance_ref 128903 // :browser
  xyzwh 133 702 2010 11 25
end
durationcanvas 137991 classinstance_ref 128903 // :browser
  xyzwh 133 780 2010 11 25
end
durationcanvas 138119 classinstance_ref 128391 // :user
  xyzwh 50 780 2010 11 26
end
reflexivemsg 128263 synchronous
  to durationcanvas_ref 128135
  yz 206 2015 explicitmsg "addWidgetDesignerForNode()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 254 188
msg 129287 synchronous
  from durationcanvas_ref 129031
  to durationcanvas_ref 129159
  yz 76 2015 msg operation_ref 128263 // "loadStudio()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 62 60
msg 129543 asynchronous
  from durationcanvas_ref 129159
  to durationcanvas_ref 129415
  yz 92 3005 explicitmsg "create and init"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 212 76
msg 130311 synchronous
  from durationcanvas_ref 129031
  to durationcanvas_ref 130183
  yz 130 2015 explicitmsg "dbl click on choosen widget"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 21 114
msg 131719 synchronous
  from durationcanvas_ref 130183
  to durationcanvas_ref 131591
  yz 155 2020 unspecifiedmsg
  show_full_operations_definition default drawing_language default show_context_mode default
reflexivemsg 132231 synchronous
  to durationcanvas_ref 132103
  yz 258 2015 explicitmsg "addWidgetDesigner"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 281 242
msg 132615 synchronous
  from durationcanvas_ref 132103
  to durationcanvas_ref 132487
  yz 280 2020 explicitmsg "create and configure datafetched handler"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 288 264
msg 133127 synchronous
  from durationcanvas_ref 132103
  to durationcanvas_ref 132999
  yz 313 2015 msg operation_ref 128391 // "fetchAndConfigure()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 365 297
msg 133895 synchronous
  from durationcanvas_ref 132999
  to durationcanvas_ref 133767
  yz 333 2020 msg operation_ref 128519 // "getWidgetData()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 600 317
msg 134663 synchronous
  from durationcanvas_ref 133767
  to durationcanvas_ref 134535
  yz 365 2015 unspecifiedmsg
  show_full_operations_definition default drawing_language default show_context_mode default
reflexivemsg 134919 synchronous
  to durationcanvas_ref 134791
  yz 421 2015 msg operation_ref 128647 // "parseFetchedData()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 555 405
reflexivemsg 135303 synchronous
  to durationcanvas_ref 135175
  yz 471 2015 msg operation_ref 128775 // "createRootNode()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 561 455
msg 135559 synchronous
  from durationcanvas_ref 135175
  to durationcanvas_ref 135431
  yz 494 2020 msg operation_ref 128903 // "configureFor()"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 648 478
reflexivemsg 136071 synchronous
  to durationcanvas_ref 135943
  yz 549 2015 explicitmsg "creates many nodes and call configureFor for each of them"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 633 533
reflexivemsg 136327 synchronous
  to durationcanvas_ref 136199
  yz 593 2015 explicitmsg "fires datafetched event"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 548 577
msg 136583 synchronous
  from durationcanvas_ref 136199
  to durationcanvas_ref 136455
  yz 619 2020 unspecifiedmsg
  show_full_operations_definition default drawing_language default show_context_mode default
msg 137479 synchronous
  from durationcanvas_ref 136455
  to durationcanvas_ref 137351
  yz 651 2015 explicitmsg "create WidgetDesigner"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 336 635
msg 137863 synchronous
  from durationcanvas_ref 137607
  to durationcanvas_ref 137735
  yz 702 2015 explicitmsg "add WidgetDesigner to studio viewport"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 124 686
msg 138247 synchronous
  from durationcanvas_ref 137991
  to durationcanvas_ref 138119
  yz 780 2015 explicitmsg "renders WI tree and other elements"
  show_full_operations_definition default drawing_language default show_context_mode default
  label_xy 0 764
end
