<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../../UserStories/Ablage/Type/DeleteAblageType.php");

final class DeleteAblageTypeTest extends TestCase
{
    public function testDoNotDeleteAblageTypeWithId1()
    {
        $ablageType = new AblageType();
        $ablageType->setId(1);
        $ablageType->setCountOfAblagen(1);

        $deleteAblageType = new DeleteAblageType();
        $deleteAblageType->setAblageType($ablageType);

        $this->assertFalse($deleteAblageType->run());
        $this->assertCount(1, $deleteAblageType->getMessages());
    }
}