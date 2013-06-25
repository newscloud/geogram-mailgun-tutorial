// Example Yii Migration for creating table for posts

  public function before() {
    $this->tablePrefix = Yii::app()->getDb()->tablePrefix;
    if ($this->tablePrefix <> '')
      $this->tableName = $this->tablePrefix.'post';
  }
  
	public function safeUp()
	{
	  $this->before();
 $this->createTable($this->tableName, array(
            'id' => 'pk',
            'author_id'=> 'INTEGER DEFAULT 0',
            'place_id'=> 'INTEGER DEFAULT 0',
            'subject' => 'string NOT NULL',
            'body' => 'TEXT',
            'status'=> 'TINYINT NOT NULL DEFAULT 0',
            'is_deleted'=> 'boolean DEFAULT FALSE',            
            'sent_at' => 'DATETIME NOT NULL DEFAULT 0',
            'ext_id'=> 'INTEGER DEFAULT 0',
            
            'created_at' => 'DATETIME NOT NULL DEFAULT 0',
            'modified_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
              ), $this->MySqlOptions);
	}

	public function safeDown()
	{
	  	$this->before();
	    $this->dropTable($this->tableName);
	}
}
