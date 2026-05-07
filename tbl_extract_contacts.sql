SELECT * FROM [dbo].[tbl_extract_contacts]
WHERE ExtractID IN (
    SELECT ExtractID 
    FROM [dbo].[tbl_extract_data]
    WHERE data_sourceID = (
        SELECT data_sourceID 
        FROM [dbo].[tbl_data_source]
        WHERE data_source_name LIKE 'AV FM retrieve%'
    )
)