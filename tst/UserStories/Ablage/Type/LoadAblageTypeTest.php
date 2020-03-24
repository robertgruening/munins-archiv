<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once(__DIR__."/../../../../src/UserStories/Ablage/Type/LoadAblageType.php");

final class LoadAblageTypeTest extends TestCase
{
    public function testLoadAblageTypeWithId1()
    {
        $loadAblageType = new LoadAblageType();
        $loadAblageType->setId(1);

        $this->assertTrue($loadAblageType->run());
        $this->assertInstanceOf(AblageType::class, $loadAblageType->getAblageType());
    }
}